import Image from "next/image";
import {
  EnvelopeIcon,
  UsersIcon,
  ChartBarSquareIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/solid";
import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/Faq";
import { Contact } from "@/components/Contact";
import { SectionTitle } from "@/components/SectionTitle";


export default function Home() {
  return (
    <>
      <Hero />

      <section id="how-it-works" className="scroll-mt-6 lg:scroll-mt-16">
        <HowItWorks />
      </section>

      <section id="features" className="scroll-mt-6 lg:scroll-mt-16">
        <Container className="px-4 lg:px-8">
          <SectionTitle
            title="Built for Small Groups"
          >
          </SectionTitle>

          <div className="grid gap-0 lg:grid-cols-5 items-center">
            {/* Left side - Feature blocks */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Feature Block 1 */}
                <div className="bg-white dark:bg-gray-800/20 rounded-lg px-2 py-1 ">
                  <div className="flex items-center mb-0">
                    <div className="w-6 h-10 rounded-lg flex items-center justify-center mr-1">
                      <EnvelopeIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Simple Invitations</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-base">Email-based class access with permanent links. Students can join your classroom with just one click.</p>
                </div>

                {/* Feature Block 2 */}
                <div className="bg-white dark:bg-gray-800/20 rounded-lg px-2 py-1 ">
                  <div className="flex items-center mb-0">
                    <div className="w-6 h-10 rounded-lg flex items-center justify-center mr-1">
                      <UsersIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Student Management</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-base">Easily add and remove students from your dashboard. Keep your classroom organized and up-to-date.</p>
                </div>

                {/* Feature Block 3 */}
                <div className="bg-white dark:bg-gray-800/20 rounded-lg px-2 py-1 ">
                  <div className="flex items-center mb-0">
                    <div className="w-6 h-10 rounded-lg flex items-center justify-center mr-1">
                      <ChartBarSquareIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Participation Insights</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-base">Monthly statistics help you track student engagement and participation patterns.</p>
                </div>

                {/* Feature Block 4 */}
                <div className="bg-white dark:bg-gray-800/20 rounded-lg px-2 py-1 ">
                  <div className="flex items-center mb-0">
                    <div className="w-6 h-10 rounded-lg flex items-center justify-center mr-1">
                      <DevicePhoneMobileIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Device Friendly</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-base">Works perfectly on desktop, tablet, and mobile with responsive design that adapts to any screen size.</p>
                </div>

                {/* Feature Block 5 */}
                <div className="bg-white dark:bg-gray-800/20 rounded-lg px-2 py-1 ">
                  <div className="flex items-center mb-0">
                    <div className="w-6 h-10 rounded-lg flex items-center justify-center mr-1">
                      <GlobeAltIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">No App Needed</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-base">Browser-based platform means no software installation required. Just open your browser and start teaching.</p>
                </div>

                {/* Feature Block 6 */}
                <div className="bg-white dark:bg-gray-800/20 rounded-lg px-2 py-1 ">
                  <div className="flex items-center mb-0">
                    <div className="w-6 h-10 rounded-lg flex items-center justify-center mr-1">
                      <AdjustmentsHorizontalIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Teacher Control</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-base">Complete control over student participation and selection. Manage your classroom your way.</p>
                </div>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="lg:col-span-2">
              <div className="relative flex justify-center">
                <Image
                  src="/img/Num-5-All-Mute.png"
                  alt="TAMAMAT Features Interface"
                  width={473}
                  height={378}
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="pricing" className="scroll-mt-6 lg:scroll-mt-16">
        <Pricing />
      </section>


      <section id="faq" className="scroll-mt-16 lg:scroll-mt-20">
        <SectionTitle
          title="Frequently Asked Questions"
        >
        </SectionTitle>
        <Faq />
      </section>

      <section id="contact" className="scroll-mt-6 lg:scroll-mt-16">
        <Contact />
      </section>
    </>
  );
}