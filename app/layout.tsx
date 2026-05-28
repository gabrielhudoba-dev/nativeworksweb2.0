import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Navigation, NavigationProvider } from "@/app/components/organisms";
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
          <ConditionalFooter />
          <Link
            href="/catalog?debug"
            className="fixed bottom-s3 right-s3 z-50 font-body text-[11px] font-medium bg-prim/10 hover:bg-prim/20 text-prim/50 rounded-full px-s1 py-[4px] transition-colors"
          >
            catalog
          </Link>
          <RhythmDev />
        </NavigationProvider>
      </body>
    </html>
  );
}
