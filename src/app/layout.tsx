import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Uncial_Antiqua } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";


const inter = Inter({ subsets: ["latin"] });
const uncialAntiqua = Uncial_Antiqua({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-uncial-antiqua"
});

export const metadata: Metadata = {
  title: "Online Platform for Small Classes | TAMAMAT",
  description:
    "TAMAMAT is an online teaching platform designed for small groups and effective lesson management tools.",
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
      <body className={`${inter.className} ${uncialAntiqua.variable}`}>
        <ThemeProvider attribute="class">
          <Navbar />
          <div>{children}</div>
          <Footer />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
