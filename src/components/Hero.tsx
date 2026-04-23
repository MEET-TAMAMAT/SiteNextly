"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import heroImg from "../../public/img/hero.png";
import { PlayCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { getHomeContent, getImageUrl } from "@/lib/directus";
import { HomeContent } from "@/types";
import { getEditableAttributes } from "@/lib/visual-editor";

export const Hero = () => {
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const isUsingDirectus = !!homeContent;

  useEffect(() => {
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

    loadHomeContent();
  }, []);

  return (
    <div>
      {/* Debug indicator */}
      <div className="text-xs text-center mb-2 opacity-50">
        Hero Data: {isUsingDirectus ? '🟢 Directus CMS' : '🔴 Fallback (hardcoded)'}
      </div>

      {/* Centered Title Section */}
      <Container className="flex w-full flex-col items-center justify-center text-center mt-1">
        <h1
          className="text-2xl font-bold leading-snug tracking-tight text-gray-800 lg:leading-tight lg:text-4xl xl:text-4xl dark:text-white"
          {...(homeContent ? getEditableAttributes('tamamat_com_home', homeContent.id, 'home_title') : {})}
        >
          {homeContent?.home_title || "Loading..."}
        </h1>
      </Container>

      {/* Main Content Blocks */}
      <Container className="px-4 lg:px-8 pt-0 lg:pt-6 xl:pt-10">
        <div className="grid lg:grid-cols-10 items-center">
          {/* Left side - Content (60%) */}
          <div className="lg:col-span-6 order-1 lg:order-1">
            <div className="max-w-2xl lg:max-w-none mb-2 lg:mb-8">
              <p
                className="mb-4 lg:mb-6 xl:mb-10 text-base leading-relaxed lg:leading-loose xl:[line-height:2.025] text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300"
                {...(homeContent ? getEditableAttributes('tamamat_com_home', homeContent.id, 'home_description') : {})}
              >
                {homeContent?.home_description || "Loading..."}
              </p>

              <div className="flex flex-row items-center justify-center">
                <Link
                  href="#how-it-works"
                  className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white px-5 py-2.5 rounded-[25px] font-semibold text-sm shadow-[0_8Apx_20px_rgba(59,130,246,0.4)] whitespace-nowrap inline-flex items-center"
                  {...(homeContent ? getEditableAttributes('tamamat_com_home', homeContent.id, 'home_button') : {})}
                >
                  {homeContent?.home_button || "Watch Video"}
                  <PlayCircleIcon className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right side - Image (40%) */}
          <div className="lg:col-span-4 order-2 lg:order-2">
            <div className="relative flex justify-center">
              <Image
                src={homeContent?.home_image ? getImageUrl(
                  typeof homeContent.home_image === 'string' 
                    ? homeContent.home_image 
                    : homeContent.home_image.id
                ) : heroImg}
                width={350}
                height={351}
                className="max-w-full h-auto object-cover"
                style={{ width: 'auto', height: 'auto' }}
                alt={homeContent?.home_title || "Online Teaching Platform for Small Groups"}
                priority
                />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};