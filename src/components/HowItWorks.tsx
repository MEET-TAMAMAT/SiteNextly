"use client";

import { useState } from 'react';
import Image from "next/image";
import { Container } from "./Container";
import { SectionTitle } from "./SectionTitle";
import { VideoModal } from "./VideoModal";
import { PlayCircleIcon } from "@heroicons/react/24/solid";

export const HowItWorks = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleWatchVideo = () => {
    setIsVideoModalOpen(true);
  };

  return (
    <Container className="px-4 lg:px-8">
      <SectionTitle
        title="Teach Faster with Smart Shortcuts"
      >
      </SectionTitle>

      <div className="grid gap-12 lg:grid-cols-10 items-center">
        {/* Left side - Image */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <div className="relative flex justify-center">
            <Image
              src="/img/Num-0-Auto.png"
              alt="TAMAMAT How It Works Interface Diagram"
              width={473}
              height={378}
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        </div>

        {/* Right side - Content */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          <div className="space-y-8">
            {/* Manual Selection Section */}
            <div className="bg-gray-100 dark:bg-gray-800/20 rounded-lg px-6 py-2">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4" style={{color: "#3B82F6"}}>
                Manual Selection
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{backgroundColor: "#3B82F6"}}></span>
                  Students are automatically assigned keyboard numbers from [1] to [9]. The button [5] mutes/unmutes all
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{backgroundColor: "#3B82F6"}}></span>
                  The teacher presses a student&apos;s number to unmute and highlight them
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{backgroundColor: "#3B82F6"}}></span>
                  A student is ready to answer
                </li>
              </ul>
            </div>

            {/* Auto Selection Section */}
            <div className="bg-gray-100 dark:bg-gray-800/20 rounded-lg px-6 py-2">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4" style={{color: "#3B82F6"}}>
                Auto Selection
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{backgroundColor: "#3B82F6"}}></span>
                  Press [0] to randomly select a student
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{backgroundColor: "#3B82F6"}}></span>
                  The system instantly chooses one participant, unmutes them, and highlights them on the screen
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{backgroundColor: "#3B82F6"}}></span>
                  Each press generates a new random selection
                </li>
              </ul>
            </div>

            {/* Button */}
            <div className="pt-4 flex justify-center">
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