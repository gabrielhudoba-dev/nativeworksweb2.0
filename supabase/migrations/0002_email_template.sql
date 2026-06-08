-- ════════════════════════════════════════════════════════════════════════════
-- Email template for proposal sharing — stored in 0_global so it's editable
-- without a code deploy. Run once in the Supabase SQL editor.
-- Keys are read via supabaseAdmin in the tools app (not exposed to public clients).
-- ════════════════════════════════════════════════════════════════════════════

insert into "0_global" (section, key, value, sort_order)
values
  -- Subject line — {{proposal_title}} is substituted at send time.
  ('proposal_email', 'subject',
   'Cenová ponuka: {{proposal_title}}',
   10),

  -- Body — {{client_name}}, {{share_url}} are substituted at send time.
  -- Keep line breaks intentional; the mailer wraps <p> per double-newline.
  ('proposal_email', 'body',
   'Ahoj {{client_name}},

pripravil som pre teba cenovú ponuku, ktorú si môžeš pozrieť tu:

{{share_url}}

Ak máš akékoľvek otázky alebo chceš niečo prebrať, daj vedieť — rád sa dohodnem na krátkej konzultácii.

S pozdravom,
Native Works',
   11)

on conflict (section, key) do update
  set value = excluded.value,
      sort_order = excluded.sort_order;
