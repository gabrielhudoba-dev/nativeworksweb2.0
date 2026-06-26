import type { Metadata } from "next";
import { redirect } from "next/navigation";
import CatalogContent from "./CatalogContent";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Problem Solving Sprint™ from €4K. Continuous Partnership™ from €3K/month. Last Mile Sprint™ from €6K. Fixed-scope engagements, clear outcomes.",
  openGraph: {
    title: "Catalog — Native Works",
    description:
      "Problem Solving Sprint™ from €4K. Continuous Partnership™ from €3K/month. Last Mile Sprint™ from €6K. Fixed-scope engagements, clear outcomes.",
    url: "https://nativeworks.eu/catalog",
  },
  twitter: {
    title: "Catalog — Native Works",
    description:
      "Problem Solving Sprint™ from €4K. Continuous Partnership™ from €3K/month. Last Mile Sprint™ from €6K. Fixed-scope engagements, clear outcomes.",
  },
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  if (!("debug" in params)) redirect("/");
  return <CatalogContent />;
}
