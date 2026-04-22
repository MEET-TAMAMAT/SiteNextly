import { createDirectus, rest, readItems, readSingleton } from "@directus/sdk";
import { HeaderConfig, NavigationItem, HomeContent, HowItWorksContent, FeaturesContent, PricingContent, FaqSectionContent, FaqItem } from "@/types";

const directus = createDirectus(
  process.env.NEXT_PUBLIC_DIRECTUS_URL as string
).with(rest());

// Header Data Fetching Functions
export async function getHeaderConfig(): Promise<HeaderConfig | null> {
  try {
    const response = await directus.request(
      readItems("header_config" as any, {
        fields: [
          "*",
          "logo.*",
          "navigation_items.*"
        ]
      })
    );

    return (response[0] as HeaderConfig) || null;
  } catch (error) {
    console.error("Failed to fetch header config:", error);
    return null;
  }
}

export async function getNavigationItems(): Promise<NavigationItem[]> {
  try {
    const response = await directus.request(
      readItems("navigation_items" as any, {
        filter: {
          is_active: {
            _eq: true
          }
        },
        sort: ["sort"]
      })
    );

    return (response as NavigationItem[]) || [];
  } catch (error) {
    console.error("Failed to fetch navigation items:", error);
    return [];
  }
}

// Helper function to get full image URL
export function getImageUrl(fileId: string): string {
  return `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${fileId}`;
}

export { directus, readItems };


// Homepage Data Fetching Functions

export async function getHomeContent(): Promise<HomeContent | null> {
  try {
    const response = await directus.request(
      readSingleton("tamamat_com_home" as any, {
        fields: [
          "*",
          "home_image.*"  // Gets image details
        ],
        filter: {
          status: {
            _eq: "published"
          }
        }
      })
    );
return (response as HomeContent) || null;
  } catch (error) {
    console.error("Failed to fetch home content:", error);
    return null;
  }
}

// How it Works Data Fetching Function
export async function getHowItWorksContent(): Promise<HowItWorksContent | null> {
  try {
    const response = await directus.request(
      readSingleton("how_it_works" as any, {
        fields: [
          "*",
          "main_illustration.*"  // Gets image details
        ],
        filter: {
          status: {
            _eq: "published"
          }
        }
      })
    );
    return (response as HowItWorksContent) || null;
  } catch (error) {
    console.error("Failed to fetch how it works content:", error);
    return null;
  }
}

// Features Section Data Fetching Function
export async function getFeaturesContent(): Promise<FeaturesContent | null> {
  try {
    const response = await directus.request(
      readSingleton("features_section" as any, {
        fields: [
          "*",
          "main_image.*"  // Gets image details
        ],
        filter: {
          status: {
            _eq: "published"
          }
        }
      })
    );
    return (response as FeaturesContent) || null;
  } catch (error) {
    console.error("Failed to fetch features content:", error);
    return null;
  }
}

// Pricing Section Data Fetching Function
export async function getPricingContent(): Promise<PricingContent | null> {
  try {
    const response = await directus.request(
      readSingleton("pricing_section" as any, {
        fields: ["*"],
        filter: {
          status: {
            _eq: "published"
          }
        }
      })
    );
    return (response as PricingContent) || null;
  } catch (error) {
    console.error("Failed to fetch pricing content:", error);
    return null;
  }
}

// FAQ Section Data Fetching Functions
export async function getFaqSectionContent(): Promise<FaqSectionContent | null> {
  try {
    const response = await directus.request(
      readSingleton("faq_section" as any, {
        fields: ["*"],
        filter: {
          status: {
            _eq: "published"
          }
        }
      })
    );
    return (response as FaqSectionContent) || null;
  } catch (error) {
    console.error("Failed to fetch FAQ section content:", error);
    return null;
  }
}

export async function getFaqItems(): Promise<FaqItem[]> {
  try {
    const response = await directus.request(
      readItems("faq_items" as any, {
        fields: ["*"],
        filter: {
          status: {
            _eq: "published"
          }
        },
        sort: ["sort"]
      })
    );
    return (response as FaqItem[]) || [];
  } catch (error) {
    console.error("Failed to fetch FAQ items:", error);
    return [];
  }
}
