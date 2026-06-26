import type { Metadata } from "next";
import { Heading, ImageBlock, Text } from "@/app/components/atoms";
import { MemberCard } from "@/app/components/organisms";
import { getContent, getMembers, getCollectiveCompanies } from "@/lib/content";
import { CompanyLogo } from "./CompanyLogo";

export const metadata: Metadata = {
  title: "Collective",
  description:
    "Meet the Native Works collective — designers, technologists, brand experts, and product managers working inside your team. From early concepts to product friction, solved.",
  openGraph: {
    title: "Collective — Native Works",
    description:
      "Meet the Native Works collective — designers, technologists, brand experts, and product managers working inside your team. From early concepts to product friction, solved.",
    url: "https://nativeworks.eu/collective",
  },
  twitter: {
    title: "Collective — Native Works",
    description:
      "Meet the Native Works collective — designers, technologists, brand experts, and product managers working inside your team. From early concepts to product friction, solved.",
  },
};

export const revalidate = 60;

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
// Row 3: [team photo spans c2–c3]
// Row 4: —           Patrik(c2)   Patricia(c3)
// Row 5: Gabriel(c1) Denis(c2)    —
// Row 6: Matej(c1)   Katarina(c2) TBD Design(c3)
// Row 7: —           —            TBD Data(c3)
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

// Static Tailwind class lookups — must be literal strings for Tailwind scanning.
const LG_COL: Record<1 | 2 | 3, string> = {
  1: "lg:col-start-1",
  2: "lg:col-start-2",
  3: "lg:col-start-3",
};
// row in MEMBERS → lg:row-start-N (rows 3+ shift +1 for the photo at row 3)
const LG_ROW: Record<number, string> = {
  1: "lg:row-start-1",
  2: "lg:row-start-2",
  4: "lg:row-start-4", // original row 3
  5: "lg:row-start-5", // original row 4
  6: "lg:row-start-6", // original row 5
  7: "lg:row-start-7", // original row 6
};

function lgRowClass(row: number): string {
  // rows 1–2 stay; rows 3+ get +1 because the photo occupies desktop row 3
  const gridRow = row <= 2 ? row : row + 1;
  return LG_ROW[gridRow] ?? "";
}


export default async function CollectivePage() {
  const [content, members, companies] = await Promise.all([getContent("collective"), getMembers(), getCollectiveCompanies()]);

  return (
    <main className="bg-white">

      {/* Hero */}
      <section className="px-page pt-s6 sm:pt-[160px] lg:pt-[216px] pb-s6 max-w-page mx-auto grid grid-cols-1 lg:grid-cols-3 gap-x-s12 gap-y-s3">
        <Heading variant="h2">{content.hero_title ?? "Collective"}</Heading>
        <div className="lg:col-start-2 lg:col-span-2 pb-s3">
          <Text variant="p1" className="text-prim">
            {content.hero_desc ?? "A curated group of product specialists."}
          </Text>
        </div>
      </section>

      {/* Members + team photo
          Mobile/tablet: natural flow in 1-col (sm: 2-col), team photo after first 3 members.
          Desktop (lg): explicit 3-col Figma grid with col/row placement via Tailwind classes. */}
      <section className="px-page max-w-page mx-auto pb-s12 pt-s6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-s9 sm:gap-x-s12 gap-y-s9 sm:gap-y-s12">

          {/* First 3 members — desktop row 1 */}
          {members.slice(0, 3).map((m) => (
            <div key={m.name + m.role} className={`${LG_COL[m.col as 1|2|3]} ${lgRowClass(m.row)}`}>
              <MemberCard name={m.name} role={m.role} bio={m.bio} avatar={m.photo ?? undefined} logos={m.logos ?? undefined} />
            </div>
          ))}

          {/* Team photo — mobile: full-width after first 3; desktop: col 2–3, row 3 */}
          <div className="col-span-1 sm:col-span-2 lg:col-start-2 lg:col-span-2 lg:row-start-3 aspect-[9/16] sm:aspect-auto sm:h-[320px] lg:h-[384px]">
            <ImageBlock src="/images/teamImageNarrow.png" alt="Native Works team" variant="fill" className="h-full" />
          </div>

          {/* Remaining members — desktop rows 2, 4–7 */}
          {members.slice(3).map((m) => (
            <div key={m.name + m.role} className={`${LG_COL[m.col as 1|2|3]} ${lgRowClass(m.row)}`}>
              <MemberCard name={m.name} role={m.role} bio={m.bio} avatar={m.photo ?? undefined} logos={m.logos ?? undefined} />
            </div>
          ))}

        </div>
      </section>

      {/* Member companies */}
      <section className="px-page max-w-page mx-auto border-t border-prim/10 pt-s9 pb-s12 lg:pb-[288px]">
        <Heading variant="h3">{content.companies_title ?? "Member companies"}</Heading>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-s4 sm:gap-s6 mt-s9">
          {companies.map((c, i) => (
            <div key={c.name} className="aspect-[3/2] overflow-hidden rounded-sm">
              {c.logo ? (
                <CompanyLogo src={c.logo} alt={c.name} dark={c.dark} />
              ) : (
                <div className={`w-full h-full ${c.dark ? "bg-prim" : "bg-surface"}`} />
              )}
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
