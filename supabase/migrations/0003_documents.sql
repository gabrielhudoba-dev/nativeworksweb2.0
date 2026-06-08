-- Extend 5_proposal_signatures to support named multi-document flows.
-- Each row = one document (contract, NDA, addendum, etc.).
-- Safe to run on an existing table — uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS.

alter table "5_proposal_signatures"
  add column if not exists document_name text,          -- human label shown in UI
  add column if not exists drive_file_id text,          -- Google Drive file ID
  add column if not exists view_url       text,         -- Google Doc viewer URL
  add column if not exists sign_url       text,         -- eSign request URL (if available)
  add column if not exists viewed_at      timestamptz,  -- first opened by client
  add column if not exists signed_at      timestamptz;  -- completed signing

-- Drop the old status constraint and recreate with 'preparing' added.
alter table "5_proposal_signatures"
  drop constraint if exists "5_proposal_signatures_status_check";

alter table "5_proposal_signatures"
  add constraint "5_proposal_signatures_status_check"
    check (status in ('preparing','created','sent','viewed','signed','declined','error'));

-- Default new rows to 'preparing' so UI shows skeleton while Drive copy runs.
alter table "5_proposal_signatures"
  alter column status set default 'preparing';
