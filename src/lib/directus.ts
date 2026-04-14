import { createDirectus, rest, readItems } from "@directus/sdk";

const directus = createDirectus(
  process.env.NEXT_PUBLIC_DIRECTUS_URL as string
).with(rest());

export { directus, readItems };
