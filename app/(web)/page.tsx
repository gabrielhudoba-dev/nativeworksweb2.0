import {
  HeroSection,
  StatsSection,
  InterveningSection,
  ServicesSection,
  SelectedWorkSection,
  CtaSection,
} from "@/app/components/organisms";
import { LogoMarquee } from "@/app/components/molecules";
import {
  getContent,
  getServices,
  getStages,
  getStats,
  getCaseStudiesItems,
} from "@/lib/content";

export const revalidate = 60; // ISR — obsah sa aktualizuje každú minútu

export default async function Home() {
  const [content, services, stages, stats, caseItems] = await Promise.all([
    getContent("home"),
    getServices(),
    getStages(),
    getStats(),
    getCaseStudiesItems(),
  ]);

  // Section order follows the Apple-inspired wireframe:
  // Hero → Clients → Stats → Process → Services → Selected work → CTA
  // (nav + footer are rendered globally by the (web) layout)
  return (
    <main className="bg-white">
      <HeroSection content={content} />

      <section className="pt-s6 sm:pt-s9 pb-s6 sm:pb-s9">
        <LogoMarquee />
      </section>

      <StatsSection content={content} stats={stats} />
      <InterveningSection content={content} stages={stages} />
      <ServicesSection content={content} services={services} />
      <SelectedWorkSection content={content} items={caseItems} />
      <CtaSection content={content} />
    </main>
  );
}
