-- ════════════════════════════════════════════════════════════════════════════
-- Proposal app — Supabase side (Notion is the primary store; this is sessions + audit)
-- Run once in the Supabase SQL editor. Idempotent.
-- ════════════════════════════════════════════════════════════════════════════

-- Notion OAuth identities that have logged in to the tools app
create table if not exists "5_users" (
  id             uuid        primary key default gen_random_uuid(),
  notion_user_id text        unique not null,
  email          text,
  name           text,
  avatar         text,
  access_token   text,
  created_at     timestamptz not null default now()
);

-- Append-only event audit (high-frequency — not worth a Notion API call per event)
create table if not exists "5_proposal_events" (
  id                 uuid        primary key default gen_random_uuid(),
  notion_proposal_id text        not null,
  event_type         text        not null
                       check (event_type in (
                         'viewed','accept_clicked','call_booked',
                         'data_verified','sign_started','signed','declined')),
  payload            jsonb       not null default '{}'::jsonb,
  created_at         timestamptz not null default now()
);

-- E-sign provider artefacts (provider-swappable)
create table if not exists "5_proposal_signatures" (
  id                 uuid        primary key default gen_random_uuid(),
  notion_proposal_id text        not null,
  provider           text        not null,
  envelope_id        text,
  document_url       text,
  status             text        not null default 'created'
                       check (status in ('created','sent','signed','declined','error')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table "5_users"               enable row level security;
alter table "5_proposal_events"     enable row level security;
alter table "5_proposal_signatures" enable row level security;
-- No public policies — all access via the service-role key (supabaseAdmin) only.
