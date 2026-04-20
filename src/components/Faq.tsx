"use client";
import React from "react";
import { Container } from "@/components/Container";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

export const Faq = () => {
  return (
    <Container className="px-4 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* First Column */}
        <div className="space-y-5">
          {faqdata.slice(0, 3).map((item, index) => (
            <div key={item.question}>
              <Disclosure defaultOpen={index === 0}>
                {({ open }) => (
                  <>
                    <DisclosureButton className="flex items-center justify-between w-full px-4 py-4 text-xl font-semibold text-left text-gray-800 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-blue-100 focus-visible:ring-opacity-75 dark:text-gray-200">
                      <span style={{color: "#3B82F6"}}>{item.question}</span>
                      <ChevronUpIcon
                        className={`${
                          open ? "transform rotate-180" : ""
                        } w-7 h-7 text-gray-700 font-black flex-shrink-0`}
                        strokeWidth={2}
                        style={{ minWidth: '28px', minHeight: '28px' }}
                      />
                    </DisclosureButton>
                    <DisclosurePanel className="px-4 pt-2 pb-2 text-base text-gray-500 dark:text-gray-300" style={{fontFamily: "var(--font-nunito), sans-serif"}}>
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
          {faqdata.slice(3, 8).map((item, index) => (
            <div key={item.question}>
              <Disclosure>
                {({ open }) => (
                  <>
                    <DisclosureButton className="flex items-center justify-between w-full px-4 py-4 text-xl font-semibold text-left text-gray-800 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-blue-100 focus-visible:ring-opacity-75 dark:text-gray-200">
                      <span style={{color: "#3B82F6"}}>{item.question}</span>
                      <ChevronUpIcon
                        className={`${
                          open ? "transform rotate-180" : ""
                        } w-7 h-7 text-gray-700 font-black flex-shrink-0`}
                        strokeWidth={2}
                        style={{ minWidth: '28px', minHeight: '28px' }}
                      />
                    </DisclosureButton>
                    <DisclosurePanel className="px-4 pt-2 pb-2 text-base text-gray-500 dark:text-gray-300" style={{fontFamily: "var(--font-nunito), sans-serif"}}>
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
}

const faqdata = [
  {
    question: "What does the Pay-as-You-Go option mean?",
    answer: "It means you only pay when you use it. No monthly or subscription fees. Pricing is based on a per-participant, per-minute model.",
  },
  {
    question: "How does the Pay-as-You-Go plan calculate the cost?",
    answer: "The platform charges $0.005 per minute per participant. For example, if you have a full class of eight students, plus the teacher and screen sharing, there are 10 participants in total. A one-hour lesson would cost about $3.",
  },
  {
    question: "Do teachers or students need to install any software, and what devices can they use?",
    answer: "No installation is required. Teachers can simply use a web browser on their computer (PC, Mac, or Linux). Students can join from a computer as well, or even use their iPhone or Android phone.",
  },
  {
    question: "How does the participation system work?",
    answer: "Each student is assigned a unique number button on the numeric keyboard, so you can either manually or automatically call up students instead of calling them by their names.",
  },
  {
    question: "Can teachers manage their students inside the platform?",
    answer: "Yes. Teachers can easily add or remove students, send invitations, add notes, and view class statistics.",
  },
  {
    question: "How do students join my classroom?",
    answer: "Teachers can send email invitations to students. All you need is the student's valid email address.",
  },
  {
    question: "Do my students need to create an account?",
    answer: "Students may log in with Gmail or register using their own email and password after receiving an invitation.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes. Your data is securely protected using SSL encryption.",
  },
];
