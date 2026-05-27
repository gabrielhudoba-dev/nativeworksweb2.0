"use client";

import {
  HeroSection,
  InterveningSection,
  PageLinksSection,
  ServicesSection,
  StatsSection,
} from "@/app/components/organisms";

export default function Home() {
  return (
    <main className="bg-white">
      <HeroSection />
      <StatsSection />
      <InterveningSection />
      <ServicesSection />
      <PageLinksSection />
    </main>
  );
}
