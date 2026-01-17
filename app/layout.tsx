import type { Metadata } from "next";
import { Inter, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSerif = Noto_Serif_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-noto-serif",
});

export const metadata: Metadata = {
  title: "Japanese Literature Journey",
  description: "A travel guidebook through Japanese literature and history.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={cn(
          "min-h-screen bg-paper font-sans antialiased",
          inter.variable,
          notoSerif.variable
        )}
      >
        <div className="flex h-screen flex-col md:flex-row overflow-hidden">
          <Navigation />
          <main className="flex-1 overflow-y-auto no-scrollbar md:p-8 p-4 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/shattered-island.png')] mix-blend-multiply"></div>
            <div className="relative z-10 max-w-5xl mx-auto h-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
