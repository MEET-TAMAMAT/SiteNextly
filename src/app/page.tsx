import Image from "next/image";
import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/FaqWrapper";
import { Contact } from "@/components/ContactWrapper";


export default function Home() {
  return (
    <>
      <Hero />
      <section id="how-it-works" className="scroll-mt-6 lg:scroll-mt-16">
        <HowItWorks />
      </section>

      <section id="features" className="scroll-mt-6 lg:scroll-mt-16">
        <Features />
      </section>

      <section id="pricing" className="scroll-mt-6 lg:scroll-mt-16">
        <Pricing />
      </section>


      <section id="faq" className="scroll-mt-16 lg:scroll-mt-20">
        <Faq />
      </section>

      <section id="contact" className="scroll-mt-6 lg:scroll-mt-16">
        <Contact />
      </section>
    </>
  );
}