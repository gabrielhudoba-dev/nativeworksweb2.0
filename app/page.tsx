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
      <div className="scroll-reveal"><StatsSection /></div>
      <div className="scroll-reveal"><InterveningSection /></div>
      <div className="scroll-reveal"><ServicesSection /></div>
      <div className="scroll-reveal"><PageLinksSection /></div>
    </main>
  );
}
