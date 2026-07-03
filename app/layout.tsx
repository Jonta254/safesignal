import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "SafeSignal", template: "%s · SafeSignal" },
  description: "Lone worker safety for the people who build everything. Automatic check-ins, GPS sharing, and escalating alerts for trade workers on the job alone.",
  keywords: ["lone worker safety", "electrician safety", "field worker", "check-in app", "trade safety"],
  openGraph: {
    title: "SafeSignal — Lone Worker Safety",
    description: "Because no one should work inside a live panel with nobody knowing where they are.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
