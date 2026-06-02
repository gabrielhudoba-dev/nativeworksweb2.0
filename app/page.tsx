import {
  HeroSection,
  InterveningSection,
  ServicesSection,
  StatsSection,
} from "@/app/components/organisms";
import { getContent, getServices, getStages, getStats } from "@/lib/content";

export const revalidate = 60; // ISR — obsah sa aktualizuje každú minútu

export default async function Home() {
  const [content, services, stages, stats] = await Promise.all([
    getContent("home"),
    getServices(),
    getStages(),
    getStats(),
  ]);

  return (
    <main className="bg-white">
      <HeroSection content={content} />
      <div className="scroll-reveal"><StatsSection content={content} stats={stats} /></div>
      <div className="scroll-reveal"><InterveningSection content={content} stages={stages} /></div>
      <div className="scroll-reveal"><ServicesSection content={content} services={services} /></div>
    </main>
  );
}
