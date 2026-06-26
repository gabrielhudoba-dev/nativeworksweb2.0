import type { Metadata } from "next";
import "@/app/globals.css";
import Link from "next/link";
import { Navigation, NavigationProvider } from "@/app/components/organisms";
import { GlobalGalleryNav } from "@/app/components/organisms/GlobalGalleryNav";
import { ConditionalFooter } from "@/app/components/ConditionalFooter";
import { RhythmDev } from "@/app/components/RhythmDev";
import { SliderNavProvider } from "@/app/context/SliderNavContext";
import { getGlobalContent } from "@/lib/content";
import { DispersionDefs } from "@/app/components/atoms";

export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL("https://nativeworks.eu"),
  title: {
    default: "Native Works",
    template: "%s — Native Works",
  },
  description:
    "A curated group of product specialists working on your mobile app or web system. Inside your team. Solving product problems from early concepts to production-ready output.",
  keywords: ["product design", "product strategy", "UX design", "product studio", "mobile app design", "web product", "human-led AI"],
  authors: [{ name: "Native Works", url: "https://nativeworks.eu" }],
  creator: "Native Works",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nativeworks.eu",
    siteName: "Native Works",
    title: "Native Works — Better product decisions. Made by humans.",
    description:
      "A curated group of product specialists working on your mobile app or web system. Inside your team. Solving product problems from early concepts to production-ready output.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Native Works — Better product decisions. Made by humans.",
    description:
      "A curated group of product specialists working on your mobile app or web system. Inside your team. Solving product problems from early concepts to production-ready output.",
    creator: "@nativeworks",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
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
            <Navigation content={globalContent} />
            <GlobalGalleryNav />
            {children}
<ConditionalFooter content={globalContent} />
            <RhythmDev />
          </SliderNavProvider>
        </NavigationProvider>
      </body>
    </html>
  );
}
