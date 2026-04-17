import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Uncial_Antiqua } from "next/font/google";
import { Nunito } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";


const inter = Inter({ subsets: ["latin"] });
const uncialAntiqua = Uncial_Antiqua({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-uncial-antiqua"
});
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito"
});

export const metadata: Metadata = {
  title: "TAMAMAT Development Site",
  description: "Development environment - Not for public use",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
    },
  },
  other: {
    "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex, nocache",
  },
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${uncialAntiqua.variable} ${nunito.variable}`}>
        <Providers>
          <Navbar />
          <div className="pt-28 lg:pb-8">{children}</div>
          <Footer />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
