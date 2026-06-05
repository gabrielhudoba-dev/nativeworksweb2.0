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
      <StatsSection content={content} stats={stats} />
      <InterveningSection content={content} stages={stages} />
      <ServicesSection content={content} services={services} />
    </main>
  );
}
