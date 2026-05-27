import Link from "next/link";

const LINKS = [
  { label: "Collective", href: "/collective" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "Process", href: "/process-insights" },
];

export function PageLinksSection() {
  return (
    <section className="px-s9 py-s9 max-w-s15 mx-auto">
      {LINKS.map(({ label, href }) => (
        <div key={href}>
          <Link
            href={href}
            className="block font-display font-medium text-h2 leading-[0.9] tracking-[-0.02em] text-prim py-s7"
          >
            {label}
          </Link>
        </div>
      ))}
    </section>
  );
}
