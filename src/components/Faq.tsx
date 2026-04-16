"use client";
import React from "react";
import { Container } from "@/components/Container";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

export const Faq = () => {
  return (
    <Container className="px-4 lg:px-8">
      <div className="w-full max-w-2xl p-2 mx-auto rounded-2xl">
        {faqdata.map((item, index) => (
          <div key={item.question} className="mb-5">
            <Disclosure>
              {({ open }) => (
                <>
                  <DisclosureButton className="flex items-center justify-between w-full px-4 py-4 text-lg text-left text-gray-800 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-100 focus-visible:ring-opacity-75 dark:bg-trueGray-800 dark:text-gray-200">
                    <span>{item.question}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? "transform rotate-180" : ""
                      } w-5 h-5`}
                      style={{color: "#3B82F6"}}
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="px-4 pt-4 pb-2 text-gray-500 dark:text-gray-300">
                    {item.answer}
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          </div>
        ))}
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
