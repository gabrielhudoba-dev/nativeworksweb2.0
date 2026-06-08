import { requireCreator } from "@/lib/auth";
import { StudioHeader } from "./StudioHeader";

export const dynamic = "force-dynamic";

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  // Gate every /tools/** route. The real check lives here and is re-run in each
  // server action — actions are reachable by direct POST.
  const session = await requireCreator();

  return (
    <div className="min-h-screen flex flex-col">
      <StudioHeader name={session.name} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
