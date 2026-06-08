#!/usr/bin/env node
/**
 * setup-google-drive.mjs  —  One-time Google Drive setup for Native Works
 *
 * Run:
 *   gcloud auth login --account=gabo@nativeworks.com
 *   gcloud config set project YOUR_PROJECT_ID
 *   node scripts/setup-google-drive.mjs
 *
 * What it does:
 *  1.  Enables Drive + Docs APIs on the GCP project
 *  2.  Creates service account  nativeworks-esign@<project>.iam.gserviceaccount.com
 *  3.  Downloads JSON key → scripts/google-service-account.json
 *  4.  Creates root Drive folder  "Native Works — Clients"
 *  5.  Shares root folder with the service account (editor)
 *  6.  Uploads all template documents to a "Templates" folder (for reference)
 *  7.  Writes env vars to .env.local:
 *        GOOGLE_SERVICE_ACCOUNT_JSON
 *        GOOGLE_DRIVE_ROOT_FOLDER
 */

import { execSync }               from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname }       from "path";
import { fileURLToPath }          from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, "..");
const GCLOUD    = "/opt/homebrew/share/google-cloud-sdk/bin/gcloud";
const TEMPLATES_DIR = resolve(__dirname, "templates");

// ── Helpers ───────────────────────────────────────────────────────────────────

function run(cmd) {
  return execSync(cmd, { encoding: "utf-8", stdio: ["pipe","pipe","pipe"] }).trim();
}

async function driveApi(method, path, body, token) {
  const res = await fetch(`https://www.googleapis.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Drive API ${method} ${path} → ${res.status}: ${await res.text()}`);
  return res.json();
}

async function docsApi(method, path, body, token) {
  const res = await fetch(`https://docs.googleapis.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Docs API ${method} ${path} → ${res.status}: ${await res.text()}`);
  return res.json();
}

async function createDocFromTemplate(name, templateFile, folderId, token) {
  const content = readFileSync(resolve(TEMPLATES_DIR, templateFile), "utf-8");
  // Create Google Doc
  const file = await driveApi("POST", "/drive/v3/files?fields=id,webViewLink", {
    name,
    mimeType: "application/vnd.google-apps.document",
    parents: [folderId],
  }, token);
  // Insert text
  await docsApi("POST", `/v1/documents/${file.id}:batchUpdate`, {
    requests: [{ insertText: { location: { index: 1 }, text: content } }],
  }, token);
  return { id: file.id, url: `https://docs.google.com/document/d/${file.id}/edit` };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🔧  Native Works — Google Drive Setup");
  console.log("    Account: gabo@nativeworks.com\n");

  // Step 0: Auth check
  let token;
  try {
    token = run(`${GCLOUD} auth print-access-token --account=gabo@nativeworks.com`);
  } catch {
    console.error("❌  Not authenticated. Run:\n    gcloud auth login --account=gabo@nativeworks.com\n");
    process.exit(1);
  }

  let project;
  try {
    project = run(`${GCLOUD} config get-value project`);
    if (!project || project === "(unset)") throw new Error();
  } catch {
    console.error("❌  No project set. Run:\n    gcloud config set project YOUR_PROJECT_ID\n");
    process.exit(1);
  }
  console.log(`✅  Authenticated — project: ${project}\n`);

  // Step 1: Enable APIs
  console.log("⏳  Enabling Google Drive & Docs APIs…");
  run(`${GCLOUD} services enable drive.googleapis.com docs.googleapis.com --project=${project}`);
  console.log("✅  APIs enabled\n");

  // Step 2: Service account
  const SA_NAME  = "nativeworks-esign";
  const SA_EMAIL = `${SA_NAME}@${project}.iam.gserviceaccount.com`;
  const KEY_PATH = resolve(ROOT, "scripts", "google-service-account.json");

  console.log(`⏳  Creating service account ${SA_EMAIL}…`);
  try {
    run(`${GCLOUD} iam service-accounts create ${SA_NAME} --display-name="Native Works eSign" --project=${project}`);
    console.log("✅  Service account created");
  } catch (e) {
    if (e.message.includes("already exists")) console.log("ℹ️   Already exists — continuing");
    else throw e;
  }

  console.log("⏳  Downloading JSON key…");
  // Remove old key if present
  try { if (existsSync(KEY_PATH)) run(`${GCLOUD} iam service-accounts keys delete $(cat ${KEY_PATH} | python3 -c "import sys,json; print(json.load(sys.stdin)['private_key_id'])") --iam-account=${SA_EMAIL} --project=${project} --quiet`); } catch {}
  run(`${GCLOUD} iam service-accounts keys create ${KEY_PATH} --iam-account=${SA_EMAIL} --project=${project}`);
  console.log(`✅  Key saved to scripts/google-service-account.json\n`);

  // Step 3: Create root Drive folder
  console.log("⏳  Creating root Drive folder  \"Native Works — Clients\"…");
  const rootFolder = await driveApi("POST", "/drive/v3/files?fields=id", {
    name: "Native Works — Clients",
    mimeType: "application/vnd.google-apps.folder",
  }, token);
  console.log(`✅  Root folder: https://drive.google.com/drive/folders/${rootFolder.id}\n`);

  // Step 4: Share root folder with service account
  console.log(`⏳  Sharing folder with ${SA_EMAIL}…`);
  await driveApi("POST", `/drive/v3/files/${rootFolder.id}/permissions`, {
    type: "user",
    role: "editor",
    emailAddress: SA_EMAIL,
  }, token);
  console.log("✅  Shared\n");

  // Step 5: Upload reference templates
  console.log("⏳  Uploading reference template documents…");
  const templatesFolder = await driveApi("POST", "/drive/v3/files?fields=id", {
    name: "_Templates (reference)",
    mimeType: "application/vnd.google-apps.folder",
    parents: [rootFolder.id],
  }, token);

  const DOCS_TO_UPLOAD = [
    { name: "NDA — Template",                    file: "nda.md"              },
    { name: "MSA — Template",                    file: "msa.md"              },
    { name: "DPA — Template (GDPR Art. 28)",     file: "dpa.md"              },
    { name: "SOW — Base Template",               file: "sow_base.md"         },
    { name: "Schedule — Web Development",        file: "module_web.md"       },
    { name: "Schedule — Brand Identity",         file: "module_brand.md"     },
    { name: "Schedule — UX Product Design",      file: "module_ux.md"        },
    { name: "Schedule — Design System",          file: "module_design_system.md" },
    { name: "Schedule — Retainer Maintenance",   file: "module_retainer.md"  },
    { name: "Change Order — Template",           file: "change_order.md"     },
  ];

  for (const { name, file } of DOCS_TO_UPLOAD) {
    const doc = await createDocFromTemplate(name, file, templatesFolder.id, token);
    console.log(`   ✓ ${name}`);
    console.log(`     ${doc.url}`);
  }
  console.log();

  // Step 6: Write .env.local
  const keyJson = readFileSync(KEY_PATH, "utf-8");
  const keyB64  = Buffer.from(keyJson).toString("base64");

  const envPath = resolve(ROOT, ".env.local");
  let env = existsSync(envPath) ? readFileSync(envPath, "utf-8") : "";

  const vars = {
    GOOGLE_SERVICE_ACCOUNT_JSON: keyB64,
    GOOGLE_DRIVE_ROOT_FOLDER:    rootFolder.id,
  };

  for (const [k, v] of Object.entries(vars)) {
    if (env.includes(`${k}=`)) {
      env = env.replace(new RegExp(`^${k}=.*$`, "m"), `${k}=${v}`);
    } else {
      env += `\n${k}=${v}`;
    }
  }
  writeFileSync(envPath, env.trim() + "\n");
  console.log("✅  .env.local updated\n");

  // Done
  console.log("═".repeat(55));
  console.log("🎉  Setup complete!");
  console.log("");
  console.log("Drive root folder (per-client subfolders created here):');");
  console.log(`  https://drive.google.com/drive/folders/${rootFolder.id}`);
  console.log("");
  console.log("Reference templates:");
  console.log(`  https://drive.google.com/drive/folders/${templatesFolder.id}`);
  console.log("");
  console.log("Remaining steps:");
  console.log("  1. Run  supabase/migrations/0003_documents.sql  in Supabase");
  console.log("  2. Open each template doc and fill in Native Works IČO + address");
  console.log("  3. Restart dev server");
  console.log("═".repeat(55));
}

main().catch((e) => { console.error("\n❌ ", e.message); process.exit(1); });
