import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Uncial_Antiqua } from "next/font/google";
import { Nunito } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

import { DirectusNavbar } from "@/components/DirectusNavbar";
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
        <ThemeProvider attribute="class" defaultTheme="light">
          <DirectusNavbar />
          <div className="pt-28 lg:pb-8">{children}</div>
          <Footer />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
