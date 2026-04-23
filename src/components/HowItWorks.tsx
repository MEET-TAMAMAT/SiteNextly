import Image from "next/image";
import { Container } from "./Container";
import { SectionTitle } from "./SectionTitle";
import { PlayCircleIcon } from "@heroicons/react/24/solid";
import { getHowItWorksContent, getImageUrl } from "@/lib/directus";
import { getEditableAttributes } from "@/lib/visual-editor";

// Helper function to convert markdown-like text to bullet points
function renderDescription(description: string) {
  return description
    .split('\n')
    .filter(line => line.trim())
    .map((line, index) => {
      const cleanLine = line.replace(/^-\s*/, '').trim();
      return (
        <li key={index} className="flex items-start">
          <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{backgroundColor: "#3B82F6"}}></span>
          {cleanLine}
        </li>
      );
    });
}

export const HowItWorks = async () => {
  const content = await getHowItWorksContent();

  // Fallback content if Directus fetch fails
  const fallbackContent = {
    id: 1, // Default ID for fallback content
    main_heading: "Teach Faster with Smart Shortcuts",
    manual_selection_title: "Manual Selection",
    manual_selection_description: "- Students are automatically assigned keyboard numbers from [1] to [9]. The button [5] mutes/unmutes all\n\n- The teacher presses a student's number to unmute and highlight them\n\n- A student is ready to answer",
    auto_selection_title: "Auto Selection",
    auto_selection_description: "- Press [0] to randomly select a student\n\n- The system instantly chooses one participant, unmutes them, and highlights them on the screen\n\n- Each press generates a new random selection",
    video_button_text: "Watch Video",
    main_illustration: null
  };

  const data = content || fallbackContent;
  const isUsingDirectus = !!content;

  return (
    <Container className="px-4 lg:px-8">
      {/* Debug indicator */}
      <div className="text-xs text-center mb-4 opacity-50">
        Data source: {isUsingDirectus ? '🟢 Directus CMS' : '🔴 Fallback (hardcoded)'}
      </div>

      <SectionTitle
        title={data.main_heading}
        {...getEditableAttributes('how_it_works', data.id, 'main_heading')}
      >
      </SectionTitle>

      <div className="grid gap-12 lg:grid-cols-10 items-center">
        {/* Left side - Image */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <div className="relative flex justify-center">
            <Image
              src={
                data.main_illustration && typeof data.main_illustration === 'object' && 'id' in data.main_illustration
                  ? getImageUrl(data.main_illustration.id)
                  : "/img/Num-0-Auto.png"
              }
              alt="TAMAMAT How It Works Interface Diagram"
              width={350}
              height={351}
              className="max-w-full h-auto rounded-lg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </div>

        {/* Right side - Content */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          <div className="space-y-8">
            {/* Manual Selection Section */}
            <div className="rounded-lg px-6 py-2">
              <h3
                className="text-xl font-bold text-gray-800 dark:text-white mb-4"
                style={{color: "#3B82F6"}}
                {...getEditableAttributes('how_it_works', data.id, 'manual_selection_title')}
              >
                {data.manual_selection_title}
              </h3>
              <ul
                className="space-y-2 text-gray-600 dark:text-gray-300"
                {...getEditableAttributes('how_it_works', data.id, 'manual_selection_description')}
              >
                {renderDescription(data.manual_selection_description)}
              </ul>
            </div>

            {/* Auto Selection Section */}
            <div className="rounded-lg px-6 py-2">
              <h3
                className="text-xl font-bold text-gray-800 dark:text-white mb-4"
                style={{color: "#3B82F6"}}
                {...getEditableAttributes('how_it_works', data.id, 'auto_selection_title')}
              >
                {data.auto_selection_title}
              </h3>
              <ul
                className="space-y-2 text-gray-600 dark:text-gray-300"
                {...getEditableAttributes('how_it_works', data.id, 'auto_selection_description')}
              >
                {renderDescription(data.auto_selection_description)}
              </ul>
            </div>

            {/* Button */}
            <div className="pt-4 flex justify-center">
              <button className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white px-5 py-2.5 rounded-[25px] font-semibold text-sm shadow-[0_8px_20px_rgba(59,130,246,0.4)] whitespace-nowrap inline-flex items-center">
                {data.video_button_text}
                <PlayCircleIcon className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};