-- ════════════════════════════════════════════════════════════════════════════
-- RESET — zmaž všetko a vytvor nové
-- Spusti v Supabase → SQL Editor
-- ════════════════════════════════════════════════════════════════════════════

drop table if exists content                        cascade;
drop table if exists home_content                   cascade;
drop table if exists collective_content             cascade;
drop table if exists capabilities_content           cascade;
drop table if exists case_studies_content           cascade;
drop table if exists services                       cascade;
drop table if exists stages                         cascade;
drop table if exists stats                          cascade;
drop table if exists members                        cascade;
drop table if exists "0_global"                     cascade;
drop table if exists "1_home"                       cascade;
drop table if exists "1_home_services"              cascade;
drop table if exists "1_home_stages"                cascade;
drop table if exists "1_home_stats"                 cascade;
drop table if exists "2_collective"                 cascade;
drop table if exists "2_collective_members"         cascade;
drop table if exists "2_collective_companies"       cascade;
drop table if exists "3_capabilities"               cascade;
drop table if exists "3_capabilities_sections"      cascade;
drop table if exists "3_capabilities_section_items" cascade;
drop table if exists "4_case_studies"               cascade;
drop table if exists "4_case_studies_items"         cascade;
drop table if exists "4_case_studies_item_stats"    cascade;

-- ════════════════════════════════════════════════════════════════════════════
-- 0 · GLOBAL  (texty zdieľané naprieč stránkami)
-- ════════════════════════════════════════════════════════════════════════════

create table "0_global" (
  section    text not null,
  key        text not null,
  value      text not null,
  sort_order int  not null default 0,
  primary key (section, key)
);

-- ════════════════════════════════════════════════════════════════════════════
-- 1 · HOME
-- ════════════════════════════════════════════════════════════════════════════

create table "1_home" (
  section    text not null,
  key        text not null,
  value      text not null,
  sort_order int  not null default 0,
  primary key (section, key)
);

create table "1_home_services" (
  id         serial primary key,
  title      text not null,
  "desc"     text not null,
  price      text not null,
  duration   text not null,
  sort_order int  not null default 0
);

create table "1_home_stages" (
  id         serial primary key,
  title      text not null,
  "desc"     text not null,
  sort_order int  not null default 0
);

create table "1_home_stats" (
  id           serial primary key,
  value        text not null,
  label        text not null,
  refer_name   text,
  refer_role   text,
  refer_avatar text,
  sort_order   int  not null default 0
);

-- ════════════════════════════════════════════════════════════════════════════
-- 2 · COLLECTIVE
-- ════════════════════════════════════════════════════════════════════════════

create table "2_collective" (
  section    text not null,
  key        text not null,
  value      text not null,
  sort_order int  not null default 0,
  primary key (section, key)
);

create table "2_collective_members" (
  id         serial primary key,
  name       text not null,
  role       text not null,
  bio        text not null,
  photo      text,
  logos      text[],
  col        int  not null check (col between 1 and 3),
  row        int  not null
);

create table "2_collective_companies" (
  id         serial primary key,
  name       text not null,
  logo       text,
  dark       boolean not null default false,
  sort_order int  not null default 0
);

-- ════════════════════════════════════════════════════════════════════════════
-- 3 · CAPABILITIES
-- ════════════════════════════════════════════════════════════════════════════

create table "3_capabilities" (
  section    text not null,
  key        text not null,
  value      text not null,
  sort_order int  not null default 0,
  primary key (section, key)
);

create table "3_capabilities_sections" (
  id         serial primary key,
  title      text not null,
  sort_order int  not null default 0
);

create table "3_capabilities_section_items" (
  id         serial primary key,
  section_id int  not null references "3_capabilities_sections"(id),
  text       text not null,
  sort_order int  not null default 0
);

-- ════════════════════════════════════════════════════════════════════════════
-- 4 · CASE STUDIES
-- ════════════════════════════════════════════════════════════════════════════

create table "4_case_studies" (
  section    text not null,
  key        text not null,
  value      text not null,
  sort_order int  not null default 0,
  primary key (section, key)
);

create table "4_case_studies_items" (
  id           serial primary key,
  type         text not null,  -- case_study | stats | text | image
  sort_order   int  not null default 0,
  variant      text,           -- left | right  (case_study)
  title        text,           -- case_study, text
  description  text,           -- case_study, text
  image_src    text,           -- case_study, image
  image_alt    text,           -- case_study, image
  author_name  text,           -- case_study, text
  author_role  text,           -- case_study, text
  author_avatar text           -- case_study, text
);

create table "4_case_studies_item_stats" (
  id         serial primary key,
  item_id    int  not null references "4_case_studies_items"(id),
  value      text not null,
  label      text not null,
  sort_order int  not null default 0
);

-- ════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════════════════════

alter table "0_global"                     enable row level security;
alter table "1_home"                       enable row level security;
alter table "1_home_services"              enable row level security;
alter table "1_home_stages"                enable row level security;
alter table "1_home_stats"                 enable row level security;
alter table "2_collective"                 enable row level security;
alter table "2_collective_members"         enable row level security;
alter table "2_collective_companies"       enable row level security;
alter table "3_capabilities"               enable row level security;
alter table "3_capabilities_sections"      enable row level security;
alter table "3_capabilities_section_items" enable row level security;
alter table "4_case_studies"               enable row level security;
alter table "4_case_studies_items"         enable row level security;
alter table "4_case_studies_item_stats"    enable row level security;

create policy "public read" on "0_global"                     for select using (true);
create policy "public read" on "1_home"                       for select using (true);
create policy "public read" on "1_home_services"              for select using (true);
create policy "public read" on "1_home_stages"                for select using (true);
create policy "public read" on "1_home_stats"                 for select using (true);
create policy "public read" on "2_collective"                 for select using (true);
create policy "public read" on "2_collective_members"         for select using (true);
create policy "public read" on "2_collective_companies"       for select using (true);
create policy "public read" on "3_capabilities"               for select using (true);
create policy "public read" on "3_capabilities_sections"      for select using (true);
create policy "public read" on "3_capabilities_section_items" for select using (true);
create policy "public read" on "4_case_studies"               for select using (true);
create policy "public read" on "4_case_studies_items"         for select using (true);
create policy "public read" on "4_case_studies_item_stats"    for select using (true);

-- ════════════════════════════════════════════════════════════════════════════
-- SEED
-- ════════════════════════════════════════════════════════════════════════════

-- ─── 0_global ─────────────────────────────────────────────────────────────────
insert into "0_global" (section, key, value, sort_order) values
  ('footer', 'tagline', 'New era of digital product design.', 1),
  ('nav',    'email',   'hello@natiweworks.eu',               2);

-- ─── 1_home ───────────────────────────────────────────────────────────────────
insert into "1_home" (section, key, value, sort_order) values
  -- Hero
  ('hero', 'title',        'New era of digital product design.',                                                                                                                                                                                                                             1),
  ('hero', 'desc',         'A curated group of product specialists working on your mobile app or web system. Inside your team. Solving product problems from early concepts to product friction. With a level of speed previously impossible. Delivered through to production-ready output.', 2),
  ('hero', 'tagline',      'Product creation is changing. Shorter cycles. Faster Outcome.',                                                                                                                                                                                                  3),
  ('hero', 'refer_name',   'Martin Mroc',                                                                                                                                                                                                                                                    4),
  ('hero', 'refer_role',   'CDO, Vibe Studio',                                                                                                                                                                                                                                               5),
  ('hero', 'refer_avatar', '/images/martin.png',                                                                                                                                                                                                                                             6),
  -- Stats
  ('stats', 'title',       'Better products.' || E'\n' || 'Delivered faster.',                                                                                                                                                                                                               7),
  ('stats', 'desc',        'Fewer steps. Higher quality. AI-accelerated.',                                                                                                                                                                                                                   8),
  -- Intervening
  ('intervening', 'title', 'Intervening' || E'\n' || 'at any stage.',                                                                                                                                                                                                                       9),
  -- Services
  ('services', 'title',    'Inside the team.' || E'\n' || 'Inside the product.',                                                                                                                                                                                                            10),
  ('services', 'desc',     'We work closely in to your product focusing on specific problem.',                                                                                                                                                                                              11),
  -- Sprint features (expandovaný obsah prvej service karty)
  ('sprint_features', 'f1_title', 'Senior-led execution',                                      12),
  ('sprint_features', 'f1_desc',  '15+ year experienced industry leaders and authorities',     13),
  ('sprint_features', 'f2_title', 'Fast delivery cycle',                                       14),
  ('sprint_features', 'f2_desc',  'integrated process',                                        15),
  ('sprint_features', 'f3_title', 'Designed in code',                                          16),
  ('sprint_features', 'f3_desc',  'Production ready solutions',                                17);

insert into "1_home_services" (title, "desc", price, duration, sort_order) values
  ('Product Sprint',         'A short, focused sprint to identify key frictions, define improvements, and design a selected part of the product.', '€5K',        '2 weeks', 1),
  ('Continuous Partnership', 'A short, focused sprint to identify key frictions, define improvements, and design a selected part of the product.', '€5k – €20k', 'Month',   2),
  ('Last Mile Sprint',       'A focused sprint to validate, refine, and bring your product to a usable, production-ready state.',                  '€10k',       '4 weeks', 3);

insert into "1_home_stages" (title, "desc", sort_order) values
  ('Early Product',   'Building from the ground up, with quality from day one',  1),
  ('Scaling Product', 'New features, growing complexity, need for structure',     2),
  ('Capacity Gaps',   'Internal team can''t keep up with speed or scope',         3),
  ('Market Pressure', 'Market moves faster than the product',                     4);

insert into "1_home_stats" (value, label, refer_name, refer_role, refer_avatar, sort_order) values
  ('2 weeks', 'Avg. time to first value',                                        null,             null,          null,                1),
  ('33%',     'Increase in weekly active user retention in Kontentino by',       'Milan Tibansky', 'Growth Lead', '/images/milan.png', 2),
  ('8/10',    'Clients continuing after first sprint',                           null,             null,          null,                3);

-- ─── 2_collective ─────────────────────────────────────────────────────────────
insert into "2_collective" (section, key, value, sort_order) values
  ('hero',      'title', 'Collective',                                                                                                                                                                                                                                                             1),
  ('hero',      'desc',  'A curated group of product specialists working on your mobile app or web system. Inside your team. Solving product problems from early concepts to product friction. Meet our members and their associated companies, from previous clients to the experiences that shape how we work.', 2),
  ('companies', 'title', 'Member companies',                                                                                                                                                                                                                                                       3);

insert into "2_collective_members" (name, role, bio, photo, logos, col, row) values
  ('Martin Mroc',      'Member, Design',              'A11, Y Combinator, thirdweb.studio, Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '/images/martin.png', '{"/logos/a11.svg","/logos/thirtweb.svg","/logos/ycombinator.svg","/logos/coinbase.svg"}', 1, 1),
  ('Mario Sustek',     'Member, Design',              'Madelo, Owning brand Ave Natura. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',      null, null,                                                                                                      2, 1),
  ('Adam Sloviak',     'Member, Technology',          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit.',              null, null,                                                                                                      3, 1),
  ('Peter Skrovan',    'Member, Brand',               'Go Big Name, Milku Buro. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',              null, null,                                                                                                      2, 2),
  ('Patrik Smejkal',   'Member, Product Management',  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit.',              null, '{"/logos/fantasy.svg","/logos/platform.svg"}',                                                          2, 3),
  ('Patricia Laktis',  'Member, Sales',               'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit.',              null, null,                                                                                                      3, 3),
  ('Gabriel Hudoba',   'Partner, Design',             'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit.',              null, '{"/logos/fantasy.svg","/logos/platform.svg"}',                                                          1, 4),
  ('Denis Nemec',      'Partner, Marketing & Sales',  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit.',              null, null,                                                                                                      2, 4),
  ('Matej Kaninsky',   'Authority, UX & Processes',   'BBC, Skoda, Lead. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',                     null, '{"/logos/skoda.svg","/logos/bbc.svg"}',                                                                 1, 5),
  ('Katarina Bohmova', 'Authority, UX, Anthropology', 'Lighting Beetle. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',                      null, null,                                                                                                      2, 5),
  ('TBD',              'Authority, Design',           'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit.',              null, null,                                                                                                      3, 5),
  ('TBD',              'Authority, Data Scientist',   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit.',              null, null,                                                                                                      3, 6);

insert into "2_collective_companies" (name, logo, dark, sort_order) values
  ('Vibe Studio',    null,                       false, 1),
  ('Madelo®',        '/images/madelo-logo.png',  true,  2),
  ('skrovan.studio', null,                       true,  3);

-- ─── 3_capabilities ───────────────────────────────────────────────────────────
insert into "3_capabilities" (section, key, value, sort_order) values
  ('hero', 'title', 'Capabilities', 1);

insert into "3_capabilities_sections" (title, sort_order) values
  ('Product Strategy',                1),  -- id 1
  ('Research & Product Insight',      2),  -- id 2
  ('Product Design',                  3),  -- id 3
  ('Product Systems',                 4),  -- id 4
  ('Human-Led AI Delivery',           5),  -- id 5
  ('Technical Architecture',          6),  -- id 6
  ('Experience Direction',            7),  -- id 7
  ('Product Analytics (light)',       8),  -- id 8
  ('AI Product Behavior',             9),  -- id 9
  ('Human-AI Interaction',           10),  -- id 10
  ('Product Adaptation under change',11);  -- id 11

insert into "3_capabilities_section_items" (section_id, text, sort_order) values
  -- Product Strategy
  (1, 'Product definition',                1),
  (1, 'Value proposition clarity',         2),
  (1, 'Product framing',                   3),
  (1, 'Ecosystem mapping',                 4),
  (1, 'Roadmap direction',                 5),
  (1, 'Decision frameworks',               6),
  (1, 'Prioritization frameworks',         7),
  -- Research & Product Insight
  (2, 'User research strategy',            1),
  (2, 'Behavioral journey mapping',        2),
  (2, 'Usability testing',                 3),
  (2, 'Concept validation',                4),
  (2, 'Product analytics interpretation',  5),
  (2, 'Feature usage analysis',            6),
  (2, 'Drop-off and conversion analysis',  7),
  (2, 'Identification of growth bottlenecks', 8),
  (2, 'Opportunity mapping',               9),
  (2, 'AI-assisted research synthesis',   10),
  -- Product Design
  (3, 'UX architecture',                   1),
  (3, 'Core interaction flows',            2),
  (3, 'Rapid prototyping',                 3),
  (3, 'Interaction redesign',              4),
  (3, 'Information architecture',          5),
  (3, 'Design systems',                    6),
  (3, 'Product writing',                   7),
  -- Product Systems
  (4, 'Friction diagnostics',              1),
  (4, 'Product structure evaluation',      2),
  (4, 'Interaction architecture audits',   3),
  (4, 'System simplification',             4),
  (4, 'Cross-team UX alignment',           5),
  (4, 'Product governance',                6),
  (4, 'Adoption strategy',                 7),
  (4, 'Structural support for product growth', 8),
  (4, 'Alignment between product logic and user behavior', 9),
  -- Human-Led AI Delivery
  (5, 'AI-assisted concept exploration',   1),
  (5, 'AI-accelerated iteration',          2),
  (5, 'Production-ready frontend',         3),
  (5, 'Targeted implementation',           4),
  (5, 'Faster validation cycles',          5),
  (5, 'Quality-controlled output',         6),
  -- Technical Architecture
  (6, 'Technical architecture evaluation', 1),
  (6, 'Platform scalability review',       2),
  (6, 'Product system restructuring',      3),
  (6, 'Technical input for AI-enabled products', 4),
  (6, 'Architecture support',              5),
  -- Experience Direction
  (7, 'Experience direction',              1),
  (7, 'Brand expression interaction',      2),
  (7, 'Trust and clarity in system behavior', 3),
  (7, 'Interaction for AI-enabled products', 4),
  (7, 'Future-facing experience principles', 5),
  (7, 'Consistency across product surfaces', 6),
  -- Product Analytics (light)
  (8, 'Product analytics interpretation',  1),
  (8, 'Feature usage analysis',            2),
  (8, 'Drop-off and conversion analysis',  3),
  (8, 'Identification of growth bottlenecks', 4),
  -- AI Product Behavior
  (9, 'Interaction patterns for AI-enabled products', 1),
  (9, 'Trust and clarity in system behavior', 2),
  (9, 'AI-assisted concept exploration',   3),
  -- Human-AI Interaction
  (10, 'Behavioral journey mapping (AI context)', 1),
  (10, 'Concept validation (AI-driven flows)',     2),
  (10, 'AI-accelerated iteration',                 3),
  -- Product Adaptation under change
  (11, 'Friction diagnostics',             1),
  (11, 'System simplification',            2),
  (11, 'Product system restructuring',     3),
  (11, 'Faster validation cycles',         4),
  (11, 'Structural support for product growth', 5);

-- ─── 4_case_studies ───────────────────────────────────────────────────────────
insert into "4_case_studies" (section, key, value, sort_order) values
  ('hero', 'title', 'Case Studies', 1);

insert into "4_case_studies_items" (type, sort_order, variant, title, description, image_src, image_alt, author_name, author_role, author_avatar) values
  -- 1: Notion AI case study
  ('case_study', 1, 'right', 'Notion AI',
   'AI features increased complexity. Users did not understand where to start or how the product worked. Core workflows became fragmented.',
   '/images/sline01.png', 'Notion AI case study',
   'Martin Novák', 'Lead Designer', '/images/martin.png'),
  -- 2: Notion AI stats (no text fields)
  ('stats', 2, null, null, null, null, null, null, null, null),
  -- 3: standalone image
  ('image', 3, null, null, null, '/images/sline01.png', 'Notion AI product showcase', null, null, null),
  -- 4: Coinbase case study (title uses \n for line break)
  ('case_study', 4, 'left', 'Coinbase' || E'\n' || 'Advanced Trade',
   'The platform was powerful but overwhelming. Advanced features reduced usability and conversion. New users dropped before first trade.',
   '/images/sline02.png', 'Coinbase Advanced Trade case study',
   'Milan Horváth', 'Lead Designer', '/images/milan.png'),
  -- 5: Coinbase stats
  ('stats', 5, null, null, null, null, null, null, null, null),
  -- 6: Linear text
  ('text', 6, null, 'Linear',
   'Rapid growth created inconsistency across the product. New features increased UX fragmentation. Internal teams moved faster than the system could support.',
   null, null,
   'Martin Novák', 'Lead Designer', '/images/martin.png'),
  -- 7: Stealth AI Startup text
  ('text', 7, null, 'Stealth AI Startup',
   'The product was built quickly using AI tools. The UI existed, but the product lacked structure, clarity, and consistency.',
   null, null,
   'Milan Horváth', 'Lead Designer', '/images/milan.png');

insert into "4_case_studies_item_stats" (item_id, value, label, sort_order) values
  -- Notion AI stats (item id 2)
  (2, '3×',    'Reduction in time-to-first-value after onboarding redesign',          1),
  (2, '40%',   'Increase in AI feature discoverability across core workflows',         2),
  (2, '4.7/5', 'Post-redesign user satisfaction score',                               3),
  (2, '2×',    'Increase in feature adoption within first week',                      4),
  (2, '60%',   'Drop in support tickets related to onboarding confusion',             5),
  -- Coinbase stats (item id 5)
  (5, '28%',   'Reduction in first-trade drop-off rate',                              1),
  (5, '2.5×',  'Increase in onboarding-to-first-trade conversion',                    2),
  (5, '9/10',  'Traders rating the redesigned advanced flow',                         3);
