import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DoseKey — Your dose. Your rhythm.",
  description: "Kişisel doz, kullanım dönemi ve ilerleme takip uygulaması.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
