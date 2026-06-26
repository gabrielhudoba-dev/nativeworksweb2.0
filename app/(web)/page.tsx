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
  getHeroSliderItems,
  type HeroSliderItem,
} from "@/lib/content";

const FALLBACK_SLIDER_ITEMS: HeroSliderItem[] = [
  { id: 1, sort_order: 1, type: "video", src: "/images/slider/slider05.mp4?v=2", mobile_src: null, alt: "Payrly – 5", overlay: null, author_name: "Gabriel Hudoba", author_role: "Payrly", author_avatar: "/images/gabo.png" },
  { id: 2, sort_order: 2, type: "image", src: "/images/slider/slider01.png", mobile_src: "/images/slider/m_slide01.png", alt: "Payrly – 1", overlay: "logo_bottom", author_name: "Gabriel Hudoba", author_role: "Payrly", author_avatar: "/images/gabo.png" },
  { id: 3, sort_order: 3, type: "image", src: "/images/slider/slider02new.png", mobile_src: null, alt: "Payrly – 2", overlay: "logo_center", author_name: "Gabriel Hudoba", author_role: "Payrly", author_avatar: "/images/gabo.png" },
  { id: 4, sort_order: 4, type: "image", src: "/images/slider/slider03.png", mobile_src: "/images/slider/m_slider03.png", alt: "Payrly – 3", overlay: "logo_bottom_invert", author_name: "Gabriel Hudoba", author_role: "Payrly", author_avatar: "/images/gabo.png" },
  { id: 5, sort_order: 5, type: "video", src: "/images/slider/slider04newnew.mp4?v=3", mobile_src: null, alt: "Payrly – 4", overlay: null, author_name: "Gabriel Hudoba", author_role: "Payrly", author_avatar: "/images/gabo.png" },
  { id: 6, sort_order: 6, type: "image", src: "/images/slider/steward.png", mobile_src: "/images/slider/m_steward.png", alt: "Steward Oaks", overlay: null, author_name: "Gabriel Hudoba", author_role: "Steward Oaks", author_avatar: "/images/gabo.png" },
];

export const revalidate = 60; // ISR — obsah sa aktualizuje každú minútu

export default async function Home() {
  const [content, services, stages, stats, caseItems, sliderItems] = await Promise.all([
    getContent("home"),
    getServices(),
    getStages(),
    getStats(),
    getCaseStudiesItems(),
    getHeroSliderItems(),
  ]);

  // Section order follows the Apple-inspired wireframe:
  // Hero → Stats → Clients → Process → Services → Selected work → CTA
  // (nav + footer are rendered globally by the (web) layout)
  return (
    <main className="bg-white">
      <HeroSection content={content} items={sliderItems.length > 0 ? sliderItems : FALLBACK_SLIDER_ITEMS} />

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
