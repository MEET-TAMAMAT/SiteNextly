import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Uncial_Antiqua } from "next/font/google";
import { Nunito } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import "./globals.css";
import "../styles/animations.css";

import { DirectusNavbar } from "@/components/DirectusNavbar-Legacy";
import { Footer } from "@/components/FooterWrapper";
import { BackToTop } from "@/components/BackToTop";
import { VisualEditorProvider } from "@/components/VisualEditorProvider";
import { ZadarmaScripts } from "@/components/ZadarmaScripts";


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
      <head>
        {/* Zadarma widget styles */}
        <link rel="preload" href="/zadarma-click-to-call/style.min.css" as="style" />
        <link rel="stylesheet" href="/zadarma-click-to-call/style.min.css" />
      </head>
      <body className={`${inter.className} ${uncialAntiqua.variable} ${nunito.variable}`}>
        <VisualEditorProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <DirectusNavbar />
            <div className="pt-28 lg:pb-8">{children}</div>
            <Footer />
            <BackToTop />
          </ThemeProvider>
        </VisualEditorProvider>

        {/* Zadarma Scripts - loaded after page content */}
        <Script
          src="/zadarma-click-to-call/detectWebRTC.min.js"
          strategy="beforeInteractive"
          id="zadarma-detectrtc"
        />
        <Script
          src="/zadarma-click-to-call/jssip.min.js"
          strategy="beforeInteractive"
          id="zadarma-jssip"
        />
        <Script
          src="/zadarma-click-to-call/widget.min.js"
          strategy="afterInteractive"
          id="zadarma-widget"
        />

      </body>
    </html>
  );
}
