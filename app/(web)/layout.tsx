import type { Metadata } from "next";
import "@/app/globals.css";
import Link from "next/link";
import { Navigation, NavigationProvider, PageLinksSection } from "@/app/components/organisms";
import { GlobalGalleryNav } from "@/app/components/organisms/GlobalGalleryNav";
import { ConditionalFooter } from "@/app/components/ConditionalFooter";
import { RhythmDev } from "@/app/components/RhythmDev";
import { SliderNavProvider } from "@/app/context/SliderNavContext";
import { getGlobalContent } from "@/lib/content";
import { DispersionDefs, CustomCursor } from "@/app/components/atoms";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Native Works",
  description: "New era of digital product design.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalContent = await getGlobalContent();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-body">
        <DispersionDefs />
        <NavigationProvider>
          <SliderNavProvider>
            <CustomCursor />
            <Navigation content={globalContent} />
            <GlobalGalleryNav />
            {children}
            <PageLinksSection />
            <ConditionalFooter content={globalContent} />
            <RhythmDev />
          </SliderNavProvider>
        </NavigationProvider>
      </body>
    </html>
  );
}
