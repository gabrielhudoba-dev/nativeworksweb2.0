import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}
