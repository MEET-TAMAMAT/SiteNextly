import { getFooterContent } from "@/lib/directus";
import { FooterClient } from "./Footer";
import { FooterContent } from "@/types";

export const Footer = async () => {
  // Fetch footer content from Directus
  const footerContent = await getFooterContent();

  // Fallback footer data if Directus fetch fails
  const fallbackFooterData: FooterContent = {
    id: "fallback",
    status: "published",
    copyright_text: "Copyright © 2026 TAMAMAT. All rights reserved.",
    copyright_year: "2026",
    twitter_url: "https://twitter.com/tamamat",
    twitter_enabled: true,
    facebook_url: "https://facebook.com/tamamat",
    facebook_enabled: true,
    instagram_url: "https://instagram.com/tamamat",
    instagram_enabled: true,
    linkedin_url: "https://linkedin.com/company/tamamat",
    linkedin_enabled: true,
    youtube_url: "https://youtube.com/@tamamat",
    youtube_enabled: true
  };

  // Use Directus data if available, otherwise fallback
  const footerData = footerContent || fallbackFooterData;
  const isUsingDirectus = !!footerContent;

  return (
    <>
      <FooterClient footerData={footerData} isUsingDirectus={isUsingDirectus} />
    </>
  );
};