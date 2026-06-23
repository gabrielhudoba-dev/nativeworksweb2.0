import {
  HeroSection,
  StatsSection,
  InterveningSection,
  ServicesSection,
  SelectedWorkSection,
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
  // Hero → Stats → Clients → Process → Services → Selected work → CTA
  // (nav + footer are rendered globally by the (web) layout)
  return (
    <main className="bg-white">
      <HeroSection content={content} />

      <StatsSection content={content} stats={stats} />

      {/* <section className="max-sm:pt-s3 max-sm:pb-s3">
        <LogoMarquee />
      </section> */}

      <InterveningSection content={content} stages={stages} />
      <ServicesSection content={content} services={services} />
      <SelectedWorkSection content={content} items={caseItems} />
    </main>
  );
}
