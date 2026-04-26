"use client";
import { useEffect, useState } from "react";
import { getHomeContent } from "@/lib/directus";
import { HomeContent } from "@/types";

export const DirectusHome = () => {
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const isUsingDirectus = !!homeContent;

  useEffect(() => {
    loadHomeContent();
  }, []);

  const loadHomeContent = async () => {
    try {
      const content = await getHomeContent();
      setHomeContent(content);
    } catch (error) {
      console.error("Failed to load home content:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!homeContent) {
    return <div>No content available</div>;
  }

  return (
    <div className="container mx-auto p-4">

      <h1>{homeContent.home_title}</h1>
      <p>{homeContent.home_description}</p>
      <button>{homeContent.home_button}</button>
      {/* Image will be added later */}
    </div>
  );
};
