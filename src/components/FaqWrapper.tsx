import { getFaqSectionContent, getFaqItems } from "@/lib/directus";
import { FaqClient } from "./Faq";
import { SectionTitle } from "./SectionTitle";
import { FaqItem } from "@/types";
import { getEditableAttributes } from "@/lib/visual-editor";

export const Faq = async () => {
  const [faqSectionContent, faqItemsData] = await Promise.all([
    getFaqSectionContent(),
    getFaqItems()
  ]);

  const faqTitle = faqSectionContent?.main_title || "Frequently Asked Questions";

  const fallbackFaqData: FaqItem[] = [
    {
      id: "1",
      question: "What does the Pay-as-You-Go option mean?",
      answer: "It means you only pay when you use it. No monthly or subscription fees. Pricing is based on a per-participant, per-minute model.",
      sort: 1,
      status: "published",
      default_open: true,
    },
    {
      id: "2",
      question: "How does the Pay-as-You-Go plan calculate the cost?",
      answer: "The platform charges $0.005 per minute per participant. For example, if you have a full class of eight students, plus the teacher and screen sharing, there are 10 participants in total. A one-hour lesson would cost about $3.",
      sort: 2,
      status: "published",
      default_open: false,
    },
    {
      id: "3",
      question: "Do teachers or students need to install any software, and what devices can they use?",
      answer: "No installation is required. Teachers can simply use a web browser on their computer (PC, Mac, or Linux). Students can join from a computer as well, or even use their iPhone or Android phone.",
      sort: 3,
      status: "published",
      default_open: false,
    },
    {
      id: "4",
      question: "How does the participation system work?",
      answer: "Each student is assigned a unique number button on the numeric keyboard, so you can either manually or automatically call up students instead of calling them by their names.",
      sort: 4,
      status: "published",
      default_open: false,
    },
    {
      id: "5",
      question: "Can teachers manage their students inside the platform?",
      answer: "Yes. Teachers can easily add or remove students, send invitations, add notes, and view class statistics.",
      sort: 5,
      status: "published",
      default_open: false,
    },
    {
      id: "6",
      question: "How do students join my classroom?",
      answer: "Teachers can send email invitations to students. All you need is the student's valid email address.",
      sort: 6,
      status: "published",
      default_open: false,
    },
    {
      id: "7",
      question: "Do my students need to create an account?",
      answer: "Students may log in with Gmail or register using their own email and password after receiving an invitation.",
      sort: 7,
      status: "published",
      default_open: false,
    },
    {
      id: "8",
      question: "Is my data secure?",
      answer: "Yes. Your data is securely protected using SSL encryption.",
      sort: 8,
      status: "published",
      default_open: false,
    },
  ];

  const faqData = faqItemsData.length > 0 ? faqItemsData : fallbackFaqData;
  const isUsingDirectus = faqItemsData.length > 0 && !!faqSectionContent;

  return (
    <>
      <SectionTitle
        title={faqTitle}
        {...getEditableAttributes('faq_section', faqSectionContent?.id || 1, 'main_title')}
      />
      <FaqClient faqData={faqData} isUsingDirectus={isUsingDirectus} />
    </>
  );
};