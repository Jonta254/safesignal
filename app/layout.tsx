import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "SafeSignal", template: "%s · SafeSignal" },
  description: "Lone worker safety for the people who build everything. On-device check-in countdowns, GPS logged on every check-in, and a clear escalation plan for the moment one is missed.",
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
