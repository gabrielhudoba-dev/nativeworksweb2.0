import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Native Works",
};

export default function ProposalLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-body bg-white">
        {children}
      </body>
    </html>
  );
}
