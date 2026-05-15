import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Offboardly AI — Your Company's Brain, Preserved Forever",
  description:
    "AI-powered institutional knowledge capture for offboarding employees. Stop losing tribal knowledge, workflows, and decision patterns when people leave. Join the waitlist.",
  keywords: [
    "institutional knowledge capture",
    "employee offboarding software",
    "knowledge transfer tool",
    "offboarding AI",
    "organizational knowledge retention",
    "knowledge management",
    "employee knowledge base",
    "tribal knowledge",
  ],
  metadataBase: new URL("https://offboardlyai.com"),
  alternates: {
    canonical: "https://offboardlyai.com",
  },
  openGraph: {
    type: "website",
    url: "https://offboardlyai.com",
    title: "Offboardly AI — Your Company's Brain, Preserved Forever",
    description:
      "42% of critical knowledge walks out the door when employees leave. Offboardly captures it through AI-powered interviews before it's gone.",
    siteName: "Offboardly AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Offboardly AI — Organizational memory, perfected",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Offboardly AI — Your Company's Brain, Preserved Forever",
    description:
      "42% of critical knowledge walks out the door when employees leave. Offboardly captures it through AI-powered interviews before it's gone.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
