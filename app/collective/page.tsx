"use client";

import { Heading, ImageBlock, Text } from "@/app/components/atoms";
import { MemberCard } from "@/app/components/organisms";

type Member = {
  name: string;
  role: string;
  bio: string;
  photo?: string;
  logos?: string[];
  col: 1 | 2 | 3;
  row: number;
};

// Grid layout from Figma (row × col):
// Row 1: Martin(c1)  Mario(c2)    Adam(c3)
// Row 2: —           Peter(c2)    —
// Row 3: —           Patrik(c2)   Patricia(c3)
// Row 4: Gabriel(c1) Denis(c2)    —
// Row 5: Matej(c1)   Katarina(c2) TBD Design(c3)
// Row 6: —           —            TBD Data(c3)
const MEMBERS: Member[] = [
  {
    name: "Martin Mroc",
    role: "Member, Design",
    bio: "A11, Y Combinator, thirdweb.studio, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit, id pulvinar augue tempus eu.",
    photo: "/images/martin.png",
    logos: ["/logos/a11.svg", "/logos/thirtweb.svg", "/logos/ycombinator.svg", "/logos/coinbase.svg"],
    col: 1, row: 1,
  },
  {
    name: "Mario Sustek",
    role: "Member, Design",
    bio: "Madelo, Owning brand Ave Natura. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit, id pulvinar augue tempus eu.",
    col: 2, row: 1,
  },
  {
    name: "Adam Sloviak",
    role: "Member, Technology",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit, id pulvinar augue tempus eu. Aenean ligula nulla, luctus ac lectus eu.",
    col: 3, row: 1,
  },
  {
    name: "Peter Skrovan",
    role: "Member, Brand",
    bio: "Go Big Name, Milku Buro. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit, id pulvinar augue tempus eu.",
    col: 2, row: 2,
  },
  {
    name: "Patrik Smejkal",
    role: "Member, Product Management",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit, id pulvinar augue tempus eu. Aenean ligula nulla, luctus ac lectus eu.",
    logos: ["/logos/fantasy.svg", "/logos/platform.svg"],
    col: 2, row: 3,
  },
  {
    name: "Patricia Laktis",
    role: "Member, Sales",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit, id pulvinar augue tempus eu. Aenean ligula nulla, luctus ac lectus eu.",
    col: 3, row: 3,
  },
  {
    name: "Gabriel Hudoba",
    role: "Partner, Design",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit, id pulvinar augue tempus eu. Aenean ligula nulla, luctus ac lectus eu.",
    logos: ["/logos/fantasy.svg", "/logos/platform.svg"],
    col: 1, row: 4,
  },
  {
    name: "Denis Nemec",
    role: "Partner, Marketing & Sales",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit, id pulvinar augue tempus eu. Aenean ligula nulla, luctus ac lectus eu.",
    col: 2, row: 4,
  },
  {
    name: "Matej Kaninsky",
    role: "Authority, UX & Processes",
    bio: "BBC, Skoda, Lead. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit, id pulvinar augue tempus eu.",
    logos: ["/logos/skoda.svg", "/logos/bbc.svg"],
    col: 1, row: 5,
  },
  {
    name: "Katarina Bohmova",
    role: "Authority, UX, Anthropology",
    bio: "Lighting Beetle. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit, id pulvinar augue tempus eu.",
    col: 2, row: 5,
  },
  {
    name: "TBD",
    role: "Authority, Design",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit, id pulvinar augue tempus eu. Aenean ligula nulla, luctus ac lectus eu.",
    col: 3, row: 5,
  },
  {
    name: "TBD",
    role: "Authority, Data Scientist",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin luctus arcu velit, id pulvinar augue tempus eu. Aenean ligula nulla, luctus ac lectus eu.",
    col: 3, row: 6,
  },
];

type Company = {
  name: string;
  logo?: string;
  dark?: boolean;
};

const COMPANIES: Company[] = [
  { name: "Vibe Studio" },
  { name: "Madelo®", logo: "/images/madelo-logo.png", dark: true },
  { name: "skrovan.studio", dark: true },
];

export default function CollectivePage() {
  return (
    <main className="bg-white">

      {/* Hero */}
      <section className="px-s11 pt-[192px] pb-s12 max-w-page mx-auto grid grid-cols-3 gap-x-s12">
        <Heading variant="page">Collective</Heading>
        <Text variant="p1" className="text-prim col-start-2 col-span-2">
          A curated group of product specialists working on your mobile app or
          web system. Inside your team. Solving product problems from early
          concepts to product friction. Meet our members and their associated
          companies, from previous clients to the experiences that shape how
          we work.
        </Text>
      </section>

      {/* Members + team photo — explicit grid placement matching Figma */}
      <section className="px-s11 max-w-page mx-auto pb-s12">
        <div className="grid grid-cols-3 gap-x-s12 gap-y-s12" style={{ gridAutoRows: "auto" }}>
          {/* Team photo at row 3, after second row of members */}
          <div style={{ gridColumn: "2 / span 2", gridRow: 3 }} className="h-[384px]">
            <ImageBlock src="/images/teamImageNarrow.png" alt="Native Works team" variant="fill" />
          </div>
          {MEMBERS.map((m) => (
            <div
              key={m.name + m.role}
              style={{ gridColumn: m.col, gridRow: m.row <= 2 ? m.row : m.row + 1 }}
            >
              <MemberCard
                name={m.name}
                role={m.role}
                bio={m.bio}
                avatar={m.photo}
                logos={m.logos}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Member companies */}
      <section className="px-s11 max-w-page mx-auto border-t border-prim/10 pt-s9 pb-[288px]">
        <Heading variant="h3">Member companies</Heading>
        <div className="flex gap-s6 mt-s9">
          {COMPANIES.map((c) => (
            <div key={c.name} className="flex-1 aspect-[3/2] overflow-hidden rounded-sm">
              {c.logo ? (
                <img
                  src={c.logo}
                  alt={c.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.style.display = "none";
                    const fallback = el.nextElementSibling as HTMLElement | null;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className={`w-full h-full ${c.dark ? "bg-prim" : "bg-surface"}`}
                style={c.logo ? { display: "none" } : undefined}
              />
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
