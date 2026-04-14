import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Benefits } from "@/components/Benefits";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Contact } from "@/components/Contact";
import { SectionTitle } from "@/components/SectionTitle";

import { benefitOne, benefitTwo } from "@/components/data";

export default function Home() {
  return (
    <>
      <Hero />

      <section id="how-it-works">
        <HowItWorks />
      </section>

      <section id="features">
        <SectionTitle
          preTitle="TAMAMAT Features"
          title="Everything You Need for Effective Online Teaching"
        >
          Our platform is designed specifically for small group lessons with features that make teaching and learning more engaging and efficient.
        </SectionTitle>

        <Benefits imgPos="right" data={benefitOne} />
        <Benefits imgPos="left" data={benefitTwo} />
      </section>

      <section id="pricing">
        <Pricing />
      </section>

      <section id="testimonials">
        <SectionTitle
          preTitle="Testimonials"
          title="What Educators Say About TAMAMAT"
        >
          Hear from teachers and language professionals who use TAMAMAT to enhance their online lessons.
        </SectionTitle>
        <Testimonials />
      </section>

      <section id="faq">
        <SectionTitle
          preTitle="FAQ"
          title="Frequently Asked Questions"
        >
          Find answers to common questions about TAMAMAT features, pricing, and technical requirements.
        </SectionTitle>
        <Faq />
      </section>

      <section id="contact">
        <Contact />
      </section>
    </>
  );
}