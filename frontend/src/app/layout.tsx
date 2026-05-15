import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Offboardly — Your Company's Brain, Preserved Forever",
  description:
    "AI-powered knowledge capture for offboarding employees. Stop losing institutional knowledge. 42% of critical knowledge walks out the door — Offboardly captures it before it's gone.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
