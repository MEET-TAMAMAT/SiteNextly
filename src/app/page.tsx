import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { SectionTitle } from "@/components/SectionTitle";
import { Benefits } from "@/components/Benefits";
import { Video } from "@/components/Video";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Cta } from "@/components/Cta";

import { benefitOne, benefitTwo } from "@/components/data";

import { directus, readItems } from "@/lib/directus";

async function getHeroData() {
  try {
    const data = await directus.request(
      readItems("hero")
    );

    return data[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function Home() {
  const heroData = await getHeroData();

  return (
    <Container>
      <Hero data={heroData} />

      <SectionTitle
        preTitle="Nextly Benefits"
        title=" Why should you use this landing page"
      >
        TAMAMAT is designed for Direct Method teaching and small group lessons of up to 8 students - perfect for language schools and beyond! Keep your students engaged with dynamic question-switching, ensuring active participation and focus. Our shortcut selection tools make managing group lessons effortless, interactive, and highly effective.
      </SectionTitle>

      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />

      <SectionTitle
        preTitle="Watch a video"
        title="Learn how to fullfil your needs"
      >
        This section is to highlight a promo or demo video of your product.
        Analysts says a landing page with video has 3% more conversion rate.
      </SectionTitle>

      <Video videoId="fZ0D0cnR88E" />

      <SectionTitle
        preTitle="Testimonials"
        title="Here's what our customers said"
      >
        Testimonials is a great way to increase the brand trust and awareness.
      </SectionTitle>

      <Testimonials />

      <SectionTitle preTitle="FAQ" title="Frequently Asked Questions">
        Answer your customers possible questions here.
      </SectionTitle>

      <Faq />

      <Cta />
    </Container>
  );
}
