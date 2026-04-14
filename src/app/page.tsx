import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { directus, readItems } from "@/lib/directus";

async function fetchSingle(collection: string) {
  try {
    const data = await directus.request(readItems(collection, { limit: 1 }));
    return data?.[0] || null;
  } catch (error) {
    console.error(`DIRECTUS ERROR (${collection}):`, error);
    return null;
  }
}

async function fetchMany(collection: string) {
  try {
    const data = await directus.request(readItems(collection));
    return data || [];
  } catch (error) {
    console.error(`DIRECTUS ERROR (${collection}):`, error);
    return [];
  }
}

export default async function Home() {
  const [
    heroData,
    howItWorksData,
    howItWorksStepsData,
    featuresData,
    featuresItemsData,
    pricingPlansData,
    faqItemsData,
    testimonialsData,
    contactData,
    contactFormData,
  ] = await Promise.all([
    fetchSingle("hero"),
    fetchSingle("how_it_works"),
    fetchMany("how_it_works_steps"),
    fetchSingle("features"),
    fetchMany("features_items"),
    fetchMany("pricing_plans"),
    fetchMany("faq_items"),
    fetchMany("testimonials"),
    fetchSingle("contact"),
    fetchSingle("contact_form"),
  ]);

  return (
    <Container>
      <Hero data={heroData} />

      {/* Next sections will be connected one by one */}
    </Container>
  );
}