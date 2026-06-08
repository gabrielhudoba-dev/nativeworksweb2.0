import { redirect } from "next/navigation";
import CatalogContent from "./CatalogContent";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  if (!("debug" in params)) redirect("/");
  return <CatalogContent />;
}
