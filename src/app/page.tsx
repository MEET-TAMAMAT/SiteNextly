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
import { Benefits } from "@/components/Benefits";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/Faq";
import { Contact } from "@/components/Contact";
import { SectionTitle } from "@/components/SectionTitle";

import { benefitOne, benefitTwo } from "@/components/data";

export default function Home() {
  return (
    <>
      <Hero />

      <section id="how-it-works">
        <HowItWorks />
      </section>

      <section id="features">
        <Container className="px-12">
          <SectionTitle
            title="Built for Small Groups"
          >
          </SectionTitle>

          <div className="grid gap-16 lg:grid-cols-2 items-center mt-16">
            {/* Left side - Feature blocks */}
            <div className="lg:col-span-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Feature Block 1 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800/20 rounded-lg flex items-center justify-center mr-3">
                      <EnvelopeIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Simple Invitations</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Email-based class access with permanent links. Students can join your classroom with just one click.</p>
                </div>

                {/* Feature Block 2 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800/20 rounded-lg flex items-center justify-center mr-3">
                      <UsersIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Student Management</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Easily add and remove students from your dashboard. Keep your classroom organized and up-to-date.</p>
                </div>

                {/* Feature Block 3 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800/20 rounded-lg flex items-center justify-center mr-3">
                      <ChartBarSquareIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Participation Insights</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Monthly statistics help you track student engagement and participation patterns.</p>
                </div>

                {/* Feature Block 4 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800/20 rounded-lg flex items-center justify-center mr-3">
                      <DevicePhoneMobileIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Device Friendly</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Works perfectly on desktop, tablet, and mobile with responsive design that adapts to any screen size.</p>
                </div>

                {/* Feature Block 5 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800/20 rounded-lg flex items-center justify-center mr-3">
                      <GlobeAltIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">No App Needed</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Browser-based platform means no software installation required. Just open your browser and start teaching.</p>
                </div>

                {/* Feature Block 6 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800/20 rounded-lg flex items-center justify-center mr-3">
                      <AdjustmentsHorizontalIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Teacher Control</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Complete control over student participation and selection. Manage your classroom your way.</p>
                </div>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="lg:col-span-1">
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

      <section id="pricing">
        <Pricing />
      </section>


      <section id="faq">
        <SectionTitle
          title="Frequently Asked Questions"
        >
        </SectionTitle>
        <Faq />
      </section>

      <section id="contact">
        <Contact />
      </section>
    </>
  );
}