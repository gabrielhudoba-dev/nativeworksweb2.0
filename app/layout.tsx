import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Navigation, NavigationProvider, PageLinksSection } from "@/app/components/organisms";
import { ConditionalFooter } from "@/app/components/ConditionalFooter";
import { RhythmDev } from "@/app/components/RhythmDev";

export const metadata: Metadata = {
  title: "Native Works",
  description: "New era of digital product design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-body">
        <NavigationProvider>
          <Navigation />
          {children}
          <PageLinksSection />
          <ConditionalFooter />
          <RhythmDev />
        </NavigationProvider>
      </body>
    </html>
  );
}
