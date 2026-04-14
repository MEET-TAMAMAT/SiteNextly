import Image from "next/image";
import { Container } from "./Container";
import { SectionTitle } from "./SectionTitle";

export const HowItWorks = () => {
  return (
    <Container>
      <SectionTitle
        preTitle="TAMAMAT Teaching Methods"
        title="How It Works"
      >
        Choose between two powerful teaching approaches designed for small group lessons.
      </SectionTitle>

      <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-2">
        {/* Manual Selection */}
        <div className="lg:col-span-1">
          <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-14 rounded-2xl py-14 dark:bg-trueGray-800">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{backgroundColor: "#3B82F6"}}>
                <span className="text-2xl font-bold text-white">1-9</span>
              </div>

              <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
                Manual Selection
              </h3>

              <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
                Students are numbered 1-9. Teacher presses the corresponding number to unmute and highlight the selected student.
              </p>

              <div className="bg-white dark:bg-trueGray-900 rounded-lg p-4 mb-4 w-full text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Special Control:</div>
                <div className="flex items-center justify-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 text-white rounded font-bold mr-2" style={{backgroundColor: "#3B82F6"}}>5</span>
                  <span className="text-gray-700 dark:text-gray-300">Mutes/unmutes all students</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Auto Selection */}
        <div className="lg:col-span-1">
          <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-14 rounded-2xl py-14 dark:bg-trueGray-800">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-6">
                <span className="text-2xl font-bold text-white">0</span>
              </div>

              <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
                Auto Selection
              </h3>

              <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
                Press 0 for random student selection with instant unmute and highlight.
              </p>

              <div className="bg-white dark:bg-trueGray-900 rounded-lg p-4 w-full text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Quick Action:</div>
                <div className="flex items-center justify-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded font-bold mr-2">0</span>
                  <span className="text-gray-700 dark:text-gray-300">Random selection + instant unmute</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Perfect for Direct Method teaching and maintaining student engagement in small group lessons.
        </p>
      </div>
    </Container>
  );
};