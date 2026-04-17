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
  title: "Online Platform for Small Classes | TAMAMAT",
  description:
    "TAMAMAT is an online teaching platform designed for small groups and effective lesson management tools.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
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
