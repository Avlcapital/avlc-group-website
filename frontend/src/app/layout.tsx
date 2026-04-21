import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import SiteHeader from "@/components/site-header";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AVLC Group Website",
  description: "Official AVLC Group corporate website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${playfair.variable} avlc-shell text-[var(--avlc-ink-900)] antialiased`}>
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl px-5 pb-10 pt-32 md:pt-36">{children}</main>

        <footer className="mt-16 border-t border-[var(--avlc-slate-200)] bg-[var(--avlc-primary)]">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-[var(--avlc-navy-900)]">
            <p>AVLC Group</p>
            <p>Copyright © 2026 AVLC Group. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
