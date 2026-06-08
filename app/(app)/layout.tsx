import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Native Tools",
  description: "Proposal builder",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-body bg-surface">
        {children}
      </body>
    </html>
  );
}
