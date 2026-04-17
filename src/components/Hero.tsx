"use client";

import { useState } from 'react';
import Image from "next/image";
import { Container } from "./Container";
import { VideoModal } from "./VideoModal";
import heroImg from "../../public/img/hero.png";
import { PlayCircleIcon } from "@heroicons/react/24/solid";

export const Hero = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleWatchVideo = () => {
    setIsVideoModalOpen(true);
  };

  return (
    <Container className="flex flex-wrap px-4 lg:px-8 pt-0 lg:pt-8 xl:pt-12">
      <div className="flex items-center w-full lg:w-1/2 lg:pl-8 xl:pl-12">
        <div className="max-w-2xl mb-2 lg:mb-8">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-800 lg:text-3xl lg:leading-tight xl:text-4xl xl:leading-tight dark:text-white text-center lg:text-left">
            Online Teaching Platform for Small Groups
          </h1>

          <p className="py-5 text-sm leading-relaxed lg:leading-loose xl:[line-height:2.025] text-gray-500 lg:text-lg xl:text-xl dark:text-gray-300">
            TAMAMAT is designed for Direct Method teaching and small group lessons
            of up to 8 students - perfect for language schools and beyond! Keep
            your students engaged with dynamic question-switching, ensuring active
            participation and focus. Our shortcut selection tools make managing
            group lessons effortless, interactive, and highly effective.
          </p>

          <div className="flex flex-row items-center justify-center">
            <button
              onClick={handleWatchVideo}
              className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white px-5 py-2.5 rounded-[25px] font-semibold text-sm shadow-[0_8px_20px_rgba(59,130,246,0.4)] whitespace-nowrap inline-flex items-center hover:shadow-[0_12px_30px_rgba(59,130,246,0.5)] transition-all duration-200"
            >
              Watch Video
              <PlayCircleIcon className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center w-full lg:w-1/2 lg:-ml-8">
        <div>
          <Image
            src={heroImg}
            width={493}
            height={494}
            className="object-cover"
            alt="Online Teaching Platform for Small Groups"
            priority
          />
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl="#"
      />
    </Container>
  );
};