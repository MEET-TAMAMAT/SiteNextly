"use client";
import React from "react";
import { Container } from "@/components/Container";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { FaqItem } from "@/types";
import { getEditableAttributes } from "@/lib/visual-editor";

interface FaqProps {
  faqData: FaqItem[];
  isUsingDirectus: boolean;
}

export const FaqClient = ({ faqData, isUsingDirectus }: FaqProps) => {
  return (
    <Container className="px-4 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* First Column */}
        <div className="space-y-5">
          {faqData.slice(0, 3).map((item, index) => (
            <div key={item.question}>
              <Disclosure defaultOpen={item.default_open}>
                {({ open }) => (
                  <>
                    <DisclosureButton className="flex items-center justify-between w-full px-4 py-4 text-xl font-semibold text-left text-gray-800 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-blue-100 focus-visible:ring-opacity-75 dark:text-gray-200">
                      <span
                        style={{color: "#3B82F6"}}
                        {...getEditableAttributes('faq_items', item.id, 'question')}
                      >
                        {item.question}
                      </span>
                      <ChevronUpIcon
                        className={`${
                          open ? "transform rotate-180" : ""
                        } w-7 h-7 text-gray-700 font-black flex-shrink-0`}
                        strokeWidth={2}
                        style={{ minWidth: '28px', minHeight: '28px' }}
                      />
                    </DisclosureButton>
                    <DisclosurePanel
                      unmount={false}
                      className="px-4 pt-2 pb-2 text-base text-gray-500 dark:text-gray-300"
                      style={{fontFamily: "var(--font-nunito), sans-serif"}}
                      {...getEditableAttributes('faq_items', item.id, 'answer')}
                    >
                      {item.answer}
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
            </div>
          ))}
        </div>

        {/* Second Column */}
        <div className="space-y-5">
          {faqData.slice(3, 8).map((item, index) => (
            <div key={item.question}>
              <Disclosure defaultOpen={item.default_open}>
                {({ open }) => (
                  <>
                    <DisclosureButton className="flex items-center justify-between w-full px-4 py-4 text-xl font-semibold text-left text-gray-800 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-blue-100 focus-visible:ring-opacity-75 dark:text-gray-200">
                      <span
                        style={{color: "#3B82F6"}}
                        {...getEditableAttributes('faq_items', item.id, 'question')}
                      >
                        {item.question}
                      </span>
                      <ChevronUpIcon
                        className={`${
                          open ? "transform rotate-180" : ""
                        } w-7 h-7 text-gray-700 font-black flex-shrink-0`}
                        strokeWidth={2}
                        style={{ minWidth: '28px', minHeight: '28px' }}
                      />
                    </DisclosureButton>
                    <DisclosurePanel
                      unmount={false}
                      className="px-4 pt-2 pb-2 text-base text-gray-500 dark:text-gray-300"
                      style={{fontFamily: "var(--font-nunito), sans-serif"}}
                      {...getEditableAttributes('faq_items', item.id, 'answer')}
                    >
                      {item.answer}
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};