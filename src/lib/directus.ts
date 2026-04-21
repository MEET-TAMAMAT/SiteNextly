import { createDirectus, rest, readItems, readSingleton } from "@directus/sdk";
import { HeaderConfig, NavigationItem, HomeContent } from "@/types";

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
          "logo.light_theme_logo.*",
          "logo.dark_theme_logo.*",
          "navigation_items.*"
        ],
        filter: {
          status: {
            _eq: "published"
          }
        }
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
