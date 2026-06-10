import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Native Works",
};

export default function ProposalLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-body bg-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-s3 focus:py-s2 focus:bg-white focus:text-prim focus:rounded-lg focus:shadow-lg focus:font-body focus:text-l2"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
