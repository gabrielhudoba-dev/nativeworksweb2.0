-- ─── content — všetky jednoduché texty webu ──────────────────────────────────
create table content (
  key   text primary key,
  value text not null
);

-- ─── members — Collective stránka ─────────────────────────────────────────────
create table members (
  id         serial primary key,
  name       text not null,
  role       text not null,
  bio        text not null,
  photo      text,
  logos      text[],
  col        int  not null check (col between 1 and 3),
  row        int  not null
);

-- ─── services — karty na hlavnej stránke ──────────────────────────────────────
create table services (
  id         serial primary key,
  title      text not null,
  desc       text not null,
  price      text not null,
  duration   text not null,
  sort_order int  not null default 0
);

-- ─── stages — StageSlider na hlavnej ──────────────────────────────────────────
create table stages (
  id         serial primary key,
  title      text not null,
  desc       text not null,
  sort_order int  not null default 0
);

-- ─── stats — štatistiky na hlavnej stránke ────────────────────────────────────
create table stats (
  id           serial primary key,
  value        text not null,
  label        text not null,
  refer_name   text,
  refer_role   text,
  refer_avatar text,
  sort_order   int  not null default 0
);

-- ─── Row Level Security — povoliť verejné čítanie ─────────────────────────────
alter table content  enable row level security;
alter table members  enable row level security;
alter table services enable row level security;
alter table stages   enable row level security;
alter table stats    enable row level security;

create policy "public read" on content  for select using (true);
create policy "public read" on members  for select using (true);
create policy "public read" on services for select using (true);
create policy "public read" on stages   for select using (true);
create policy "public read" on stats    for select using (true);

-- ─── Seed — všetky texty webu ─────────────────────────────────────────────────

insert into content (key, value) values
  -- Hero
  ('hero_title',        'New era of digital product design.'),
  ('hero_desc',         'A curated group of product specialists working on your mobile app or web system. Inside your team. Solving product problems from early concepts to product friction. With a level of speed previously impossible. Delivered through to production-ready output.'),
  ('hero_tagline',      'Product creation is changing. Shorter cycles. Faster Outcome.'),
  ('hero_refer_name',   'Martin Mroc'),
  ('hero_refer_role',   'CDO, Vibe Studio'),

  -- Stats sekcia
  ('stats_title',       'Better products.' || E'\n' || 'Delivered faster.'),
  ('stats_desc',        'Fewer steps. Higher quality. AI-accelerated.'),

  -- Services sekcia
  ('services_title',    'Inside the team.' || E'\n' || 'Inside the product.'),
  ('services_desc',     'We work closely in to your product focusing on specific problem.'),

  -- Intervening sekcia
  ('intervening_title', 'Intervening' || E'\n' || 'at any stage.'),

  -- Collective stránka
  ('collective_title',  'Collective'),
  ('collective_desc',   'A curated group of product specialists working on your mobile app or web system. Inside your team. Solving product problems from early concepts to product friction. Meet our members and their associated companies, from previous clients to the experiences that shape how we work.'),

  -- Capabilities stránka
  ('capabilities_title', 'Capabilities'),

  -- Case Studies stránka
  ('case_studies_title', 'Case Studies');


insert into members (name, role, bio, photo, logos, col, row) values
  ('Martin Mroc',      'Member, Design',                   'A11, Y Combinator, thirdweb.studio, Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '/images/martin.png', '{"/logos/a11.svg","/logos/thirtweb.svg","/logos/ycombinator.svg","/logos/coinbase.svg"}', 1, 1),
  ('Mario Sustek',     'Member, Design',                   'Madelo, Owning brand Ave Natura. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',      null,                  null,                                                                                       2, 1),
  ('Adam Sloviak',     'Member, Technology',               'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit.',              null,                  null,                                                                                       3, 1),
  ('Peter Skrovan',    'Member, Brand',                    'Go Big Name, Milku Buro. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',              null,                  null,                                                                                       2, 2),
  ('Patrik Smejkal',   'Member, Product Management',       'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit.',              null,                  '{"/logos/fantasy.svg","/logos/platform.svg"}',                                            2, 3),
  ('Patricia Laktis',  'Member, Sales',                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit.',              null,                  null,                                                                                       3, 3),
  ('Gabriel Hudoba',   'Partner, Design',                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit.',              null,                  '{"/logos/fantasy.svg","/logos/platform.svg"}',                                            1, 4),
  ('Denis Nemec',      'Partner, Marketing & Sales',       'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit.',              null,                  null,                                                                                       2, 4),
  ('Matej Kaninsky',   'Authority, UX & Processes',        'BBC, Skoda, Lead. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',                     null,                  '{"/logos/skoda.svg","/logos/bbc.svg"}',                                                   1, 5),
  ('Katarina Bohmova', 'Authority, UX, Anthropology',      'Lighting Beetle. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',                      null,                  null,                                                                                       2, 5),
  ('TBD',              'Authority, Design',                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit.',              null,                  null,                                                                                       3, 5),
  ('TBD',              'Authority, Data Scientist',        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit.',              null,                  null,                                                                                       3, 6);


insert into services (title, desc, price, duration, sort_order) values
  ('Product Sprint',          'A short, focused sprint to identify key frictions, define improvements, and design a selected part of the product.', '€5K',         '2 weeks', 1),
  ('Continuous Partnership',  'A short, focused sprint to identify key frictions, define improvements, and design a selected part of the product.', '€5k – €20k',  'Month',   2),
  ('Last Mile Sprint',        'A focused sprint to validate, refine, and bring your product to a usable, production-ready state.',                  '€10k',        '4 weeks', 3);


insert into stages (title, desc, sort_order) values
  ('Early Product',       'Building from the ground up, with quality from day one',   1),
  ('Scaling Product',     'New features, growing complexity, need for structure',      2),
  ('Capacity Gaps',       'Internal team can''t keep up with speed or scope',          3),
  ('Market Pressure',     'Market moves faster than the product',                      4);


insert into stats (value, label, refer_name, refer_role, refer_avatar, sort_order) values
  ('2 weeks', 'Avg. time to first value',                                             null,             null,          null,                 1),
  ('33%',     'Increase in weekly active user retention in Kontentino by',            'Milan Tibansky', 'Growth Lead', '/images/milan.png',  2),
  ('8/10',    'Clients continuing after first sprint',                                null,             null,          null,                 3);
