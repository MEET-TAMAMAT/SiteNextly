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

export default async function Home() {
  const heroData = await fetchSingle("hero");

  return (
    <Container>
      <Hero data={heroData} />
    </Container>
  );
}