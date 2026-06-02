import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Navigation, NavigationProvider, PageLinksSection } from "@/app/components/organisms";
import { ConditionalFooter } from "@/app/components/ConditionalFooter";
import { RhythmDev } from "@/app/components/RhythmDev";
import { getGlobalContent } from "@/lib/content";

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
        <NavigationProvider>
          <Navigation content={globalContent} />
          {children}
          <PageLinksSection />
          <ConditionalFooter content={globalContent} />
          <RhythmDev />
        </NavigationProvider>
      </body>
    </html>
  );
}
