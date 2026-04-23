import { getContactContent } from "@/lib/directus";
import { ContactClient } from "./Contact";
import { SectionTitle } from "./SectionTitle";
import { ContactContent } from "@/types";

export const Contact = async () => {
  // Fetch contact content from Directus
  const contactContent = await getContactContent();

  // Fallback contact data if Directus fetch fails
  const fallbackContactData: ContactContent = {
    id: "fallback",
    status: "published",
    main_title: "Ways to Reach Us",
    contact_info_title: "Contact Information",
    form_title: "Send Us a Message",
    email_address: "info@tamamat.com",
    email_label: "Email",
    telegram_handle: "@tamamatinfo",
    telegram_label: "Telegram",
    support_hours_days: "Monday - Friday",
    support_hours_time: "9:00 AM - 5:00 PM",
    support_hours_label: "Support Hours",
    name_field_label: "Name",
    name_field_placeholder: "Your name",
    email_field_label: "Email",
    email_field_placeholder: "Your email",
    subject_field_label: "Subject",
    subject_field_placeholder: "Email subject",
    message_field_label: "Message",
    message_field_placeholder: "Tell us more about your question or how we can help...",
    submit_button_text: "Send Message",
    success_message: "Thank you for your message! We'll get back to you soon."
  };

  // Use Directus data if available, otherwise fallback
  const contactData = contactContent || fallbackContactData;
  const isUsingDirectus = !!contactContent;

  return (
    <>
      {/* Debug indicator */}
      <div className="text-xs text-center mb-4 opacity-50">
        Contact Data: {isUsingDirectus ? '🟢 Directus CMS' : '🔴 Fallback (hardcoded)'}
      </div>
      <SectionTitle title={contactData.main_title} />
      <ContactClient contactData={contactData} isUsingDirectus={isUsingDirectus} />
    </>
  );
};