import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import heroImg from "../../public/img/hero.png";
import { PlayCircleIcon } from "@heroicons/react/24/solid";

export const Hero = () => {
  return (
    <div>
      {/* Centered Title Section */}
      <Container className="flex w-full flex-col items-center justify-center text-center mt-1">
        <h1 className="text-2xl font-bold leading-snug tracking-tight text-gray-800 lg:leading-tight lg:text-4xl xl:text-4xl dark:text-white">
          Online Teaching Platform for Small Groups
        </h1>
      </Container>

      {/* Main Content Blocks */}
      <Container className="px-4 lg:px-8 pt-0 lg:pt-6 xl:pt-10">
        <div className="grid lg:grid-cols-10 items-center">
          {/* Left side - Content (60%) */}
          <div className="lg:col-span-6 order-1 lg:order-1">
            <div className="max-w-2xl lg:max-w-none mb-2 lg:mb-8">
              <p className="mb-4 lg:mb-6 xl:mb-10 text-base leading-relaxed lg:leading-loose xl:[line-height:2.025] text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
                TAMAMAT is designed for Direct Method teaching and small group lessons
                of up to 8 students - perfect for language schools and beyond! Keep
                your students engaged with dynamic question-switching, ensuring active
                participation and focus. Our shortcut selection tools make managing
                group lessons effortless, interactive, and highly effective.
              </p>

              <div className="flex flex-row items-center justify-center">
                <Link
                  href="#how-it-works"
                  className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white px-5 py-2.5 rounded-[25px] font-semibold text-sm shadow-[0_8px_20px_rgba(59,130,246,0.4)] whitespace-nowrap inline-flex items-center"
                >
                  Watch Video
                  <PlayCircleIcon className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right side - Image (40%) */}
          <div className="lg:col-span-4 order-2 lg:order-2">
            <div className="relative flex justify-center">
              <Image
                src={heroImg}
                width={350}
                height={351}
                className="max-w-full h-auto object-cover"
                alt="Online Teaching Platform for Small Groups"
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};