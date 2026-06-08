/**
 * Notion adapter — Company (Clients) + Point Of Contacts databases.
 * Maps to the existing Native Works CRM in Notion.
 *
 * Required env vars:
 *   NOTION_TOKEN           — internal integration token (server-side only)
 *   NOTION_CLIENTS_DB_ID   — Company database
 *   NOTION_CONTACTS_DB_ID  — Point Of Contacts database
 */

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

function headers() {
  return {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotionClient = {
  notionPageId: string;       // Company DB page ID
  contactPageId: string | null; // Point of Contacts page ID (first linked contact)
  companyName: string;
  legalName: string;          // Legal Company Name
  regId: string;              // Company Registration Number (IČO)
  vatId: string;              // Tax ID / VAT ID (DIČ)
  address: string;            // Billing Address
  billingEmail: string;       // Company billing email
  signatoryName: string;      // Signatory Name (for contracts)
  contactName: string;        // Contact person name (from Point of Contacts)
  contactEmail: string;       // Contact person email (from Point of Contacts)
  contactPhone: string;       // Contact person phone (from Point of Contacts)
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function richText(value: string) {
  return [{ type: "text", text: { content: value ?? "" } }];
}

function plainText(prop: { rich_text?: Array<{ plain_text: string }> } | undefined): string {
  return prop?.rich_text?.map((t) => t.plain_text).join("") ?? "";
}

function titleText(prop: { title?: Array<{ plain_text: string }> } | undefined): string {
  return prop?.title?.map((t) => t.plain_text).join("") ?? "";
}

async function notionFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${NOTION_API}${path}`, {
    ...init,
    headers: { ...headers(), ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Notion API error ${res.status}: ${body}`);
  }
  return res.json() as Promise<Record<string, unknown>>;
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

type ContactInfo = {
  contactPageId: string | null;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
};

function pageToClientBase(page: Record<string, unknown>): Omit<NotionClient, keyof ContactInfo> {
  const p = page.properties as Record<string, unknown>;
  return {
    notionPageId:  page.id as string,
    companyName:   titleText(p["Company Name"] as never),
    legalName:     plainText(p["Legal Company Name"] as never),
    regId:         plainText(p["Company Registration Number"] as never),
    vatId:         plainText(p["Tax ID / VAT ID"] as never),
    address:       plainText(p["Billing Address"] as never),
    billingEmail:  (p["Billing Email"] as { email?: string })?.email ?? "",
    signatoryName: plainText(p["Signatory Name"] as never),
  };
}

async function fetchContactForCompany(companyPage: Record<string, unknown>): Promise<ContactInfo> {
  const p = companyPage.properties as Record<string, unknown>;
  const relation = (p["People"] as { relation?: Array<{ id: string }> })?.relation ?? [];
  if (relation.length === 0) {
    return { contactPageId: null, contactName: "", contactEmail: "", contactPhone: "" };
  }
  const contactId = relation[0].id;
  try {
    const cp = await notionFetch(`/pages/${contactId}`);
    const cProps = cp.properties as Record<string, unknown>;
    return {
      contactPageId: contactId,
      contactName:   titleText(cProps["Name"] as never),
      contactEmail:  (cProps["Email"] as { email?: string })?.email ?? "",
      contactPhone:  (cProps["Phone"] as { phone_number?: string })?.phone_number ?? "",
    };
  } catch {
    return { contactPageId: null, contactName: "", contactEmail: "", contactPhone: "" };
  }
}

function companyProperties(
  fields: Partial<Omit<NotionClient, "notionPageId" | "contactPageId" | "contactName" | "contactEmail" | "contactPhone">>
): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  if (fields.companyName !== undefined)
    props["Company Name"] = { title: richText(fields.companyName) };
  if (fields.legalName !== undefined)
    props["Legal Company Name"] = { rich_text: richText(fields.legalName) };
  if (fields.regId !== undefined)
    props["Company Registration Number"] = { rich_text: richText(fields.regId) };
  if (fields.vatId !== undefined)
    props["Tax ID / VAT ID"] = { rich_text: richText(fields.vatId) };
  if (fields.address !== undefined)
    props["Billing Address"] = { rich_text: richText(fields.address) };
  if (fields.billingEmail !== undefined)
    props["Billing Email"] = { email: fields.billingEmail || null };
  if (fields.signatoryName !== undefined)
    props["Signatory Name"] = { rich_text: richText(fields.signatoryName) };
  return props;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Search companies by name (partial match). Returns up to 10 results. Contact fields are empty — call getClient() for full data. */
export async function findClientsByName(query: string): Promise<NotionClient[]> {
  const data = await notionFetch(
    `/databases/${process.env.NOTION_CLIENTS_DB_ID}/query`,
    {
      method: "POST",
      body: JSON.stringify({
        filter: { property: "Company Name", title: { contains: query } },
        page_size: 10,
      }),
    }
  );
  return ((data.results as Array<Record<string, unknown>>) ?? []).map((page) => ({
    ...pageToClientBase(page),
    contactPageId: null,
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  }));
}

/** Fetch a single client by Company page ID, including first linked contact. */
export async function getClient(pageId: string): Promise<NotionClient | null> {
  try {
    const page = await notionFetch(`/pages/${pageId}`);
    const contact = await fetchContactForCompany(page);
    return { ...pageToClientBase(page), ...contact };
  } catch {
    return null;
  }
}

/** Create a new company + optional contact person in Notion. */
export async function createClient(
  fields: Omit<NotionClient, "notionPageId" | "contactPageId">
): Promise<NotionClient> {
  const companyPage = await notionFetch("/pages", {
    method: "POST",
    body: JSON.stringify({
      parent: { database_id: process.env.NOTION_CLIENTS_DB_ID },
      properties: companyProperties(fields),
    }),
  });
  const companyId = companyPage.id as string;

  let contactPageId: string | null = null;
  if (fields.contactName || fields.contactEmail || fields.contactPhone) {
    const contactPage = await notionFetch("/pages", {
      method: "POST",
      body: JSON.stringify({
        parent: { database_id: process.env.NOTION_CONTACTS_DB_ID },
        properties: {
          "Name":   { title: richText(fields.contactName ?? "") },
          "Email":  { email: fields.contactEmail || null },
          "Phone":  { phone_number: fields.contactPhone || null },
          "Client": { relation: [{ id: companyId }] },
        },
      }),
    });
    contactPageId = contactPage.id as string;
  }

  return {
    ...pageToClientBase(companyPage),
    contactPageId,
    contactName:  fields.contactName ?? "",
    contactEmail: fields.contactEmail ?? "",
    contactPhone: fields.contactPhone ?? "",
  };
}

/** Update company billing fields. Only provided fields are changed. */
export async function updateClient(
  pageId: string,
  fields: Partial<Omit<NotionClient, "notionPageId" | "contactPageId" | "contactName" | "contactEmail" | "contactPhone">>
): Promise<NotionClient> {
  const page = await notionFetch(`/pages/${pageId}`, {
    method: "PATCH",
    body: JSON.stringify({ properties: companyProperties(fields) }),
  });
  const contact = await fetchContactForCompany(page);
  return { ...pageToClientBase(page), ...contact };
}
