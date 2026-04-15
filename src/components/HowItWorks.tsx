import Image from "next/image";
import { Container } from "./Container";
import { SectionTitle } from "./SectionTitle";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";

export const HowItWorks = () => {
  return (
    <Container>
      <SectionTitle
        preTitle="HOW IT WORKS"
        title="Teach Faster with Smart Shortcuts"
      >
      </SectionTitle>

      <div className="grid gap-16 lg:grid-cols-2 items-center">
        {/* Left side - Image */}
        <div className="lg:col-span-1">
          <div className="relative flex justify-center">
            <Image
              src="/img/Num-0-Auto.png"
              alt="TAMAMAT How It Works Interface Diagram"
              width={450}
              height={360}
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        </div>

        {/* Right side - Content */}
        <div className="lg:col-span-1">
          <div className="space-y-8">
            {/* Manual Selection Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
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
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
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

            {/* Buttons */}
            <div className="pt-4 flex gap-4">
              <button className="inline-flex items-center px-6 py-3 text-white rounded-lg font-medium transition-colors hover:opacity-90 h-12" style={{backgroundColor: "#3B82F6"}}>
                Advanced Features
                <ArrowDownCircleIcon className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};