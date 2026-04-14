import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { directus, readItems } from "@/lib/directus";

async function getHeroData() {
  try {
    const data = await directus.request(readItems("hero"));
    console.log("DIRECTUS HERO DATA:", data);
    return data;
  } catch (error) {
    console.error("DIRECTUS ERROR:", error);
    return null;
  }
}

export default async function Home() {
  const heroData = await getHeroData();

  return (
    <Container>
      <Hero data={heroData?.[0] || null} />

      <pre className="mt-10 whitespace-pre-wrap text-xs">
        {JSON.stringify(heroData, null, 2)}
      </pre>
    </Container>
  );
}