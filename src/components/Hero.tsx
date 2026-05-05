import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import heroImg from "../../public/img/hero.png";
import { PlayCircleIcon } from "@heroicons/react/24/solid";
import { getHomeContent, getImageUrl } from "@/lib/directus";
import { HomeContent } from "@/types";
import { getEditableAttributes } from "@/lib/visual-editor";

// Force dynamic rendering for Visual Editor (temporarily removed for deployment)
// export const revalidate = 0;

export const Hero = async () => {
  // Server-side data fetching
  const homeContent = await getHomeContent();

  // Fallback content if Directus is not available
  const fallbackHomeContent: HomeContent = {
    id: "fallback",
    status: "published",
    home_title: "Online Platform for Small Classes",
    home_description: "TAMAMAT is an online teaching platform designed for small groups and effective lesson management tools.",
    home_button: "Watch Video",
    home_image: null,
    created_on: "",
    updated_on: ""
  };

  const content = homeContent || fallbackHomeContent;
  const isUsingDirectus = !!homeContent;

  return (
    <div>
      {/* Centered Title Section */}
      <Container className="flex w-full flex-col items-center justify-center text-center mt-1">
        <h1
          className="hero-title text-2xl font-bold leading-snug tracking-tight text-gray-800 lg:leading-tight lg:text-4xl xl:text-4xl dark:text-white"
          {...(isUsingDirectus ? getEditableAttributes('tamamat_com_home', content.id, 'home_title') : {})}
        >
          {content.home_title}
        </h1>
      </Container>

      {/* Main Content Blocks */}
      <Container className="px-4 lg:px-8 pt-0 lg:pt-6 xl:pt-10">
        <div className="grid lg:grid-cols-10 items-center">
          {/* Left side - Content (60%) */}
          <div className="lg:col-span-6 order-1 lg:order-1">
            <div className="max-w-2xl lg:max-w-none mb-2 lg:mb-8">
              <p
                className="hero-description mb-4 lg:mb-6 xl:mb-10 text-base leading-relaxed lg:leading-loose xl:[line-height:2.025] text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300"
                {...(isUsingDirectus ? getEditableAttributes('tamamat_com_home', content.id, 'home_description') : {})}
              >
                {content.home_description}
              </p>

              <div className="hero-buttons flex flex-row items-center justify-center">
                <Link
                  href="#how-it-works"
                  className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white px-5 py-2.5 rounded-[25px] font-semibold text-sm shadow-[0_8Apx_20px_rgba(59,130,246,0.4)] whitespace-nowrap inline-flex items-center hover:transform hover:scale-105 transition-transform duration-200"
                  {...(isUsingDirectus ? getEditableAttributes('tamamat_com_home', content.id, 'home_button') : {})}
                >
                  {content.home_button}
                  <PlayCircleIcon className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right side - Image (40%) */}
          <div className="lg:col-span-4 order-2 lg:order-2">
            <div className="relative flex justify-center">
              <Image
                src={content.home_image ? getImageUrl(
                  typeof content.home_image === 'string'
                    ? content.home_image
                    : content.home_image.id
                ) : heroImg}
                width={350}
                height={351}
                className="hero-image max-w-full h-auto object-cover"
                style={{ width: 'auto', height: 'auto' }}
                alt={content.home_title}
                priority
                {...(isUsingDirectus ? getEditableAttributes('tamamat_com_home', content.id, 'home_image') : {})}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};