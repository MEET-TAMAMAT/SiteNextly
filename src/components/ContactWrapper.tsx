import { getContactContent } from "@/lib/directus";
import { ZadarmaContactForm } from "./Contact";
import { ZadarmaContactFormMigrated } from "./ContactFormMigrated";
import { SectionTitle } from "./SectionTitle";
import { ContactContent } from "@/types";
import { getEditableAttributes } from "@/lib/visual-editor";

// Force dynamic rendering for Visual Editor (temporarily removed for deployment)
// export const revalidate = 0;

export const Contact = async () => {
  const contactContent = await getContactContent();

  const fallbackContactData: ContactContent = {
    id: "fallback",
    status: "published",
    main_title: "Ways to Reach Us",
    contact_info_title: "Contact Information",
    form_title: "Send Us a Message as a",
    email_address: "info@tamamat.com",
    email_label: "Email",
    telegram_handle: "@tamamatinfo",
    telegram_label: "Telegram",
    support_hours_days: "Monday - Friday",
    support_hours_time: "9:00 AM - 5:00 PM",
    support_hours_label: "Support Hours",
    name_field_placeholder: "Your name",
    email_field_placeholder: "Your email",
    message_field_placeholder: "Tell us more about your question or how we can help...",
    submit_button_text: "Send Message",
    success_message: "Thank you for your message! We'll get back to you soon.",
    // New Zadarma fields
    phone_field_placeholder: "Your phone in international format e.g. +380XXXXXXXXX",
    company_field_placeholder: "School/Company Name",
    lead_status_teacher_label: "Teacher/Person",
    lead_status_school_label: "School/Company",
    messenger_dropdown_placeholder: "Specify your favorite messenger",
    messenger_field_placeholder: "Username or phone number associated with the messenger",
    country_field_placeholder: "Select Your Country (optional)",
    website_field_placeholder: "Company or personal website (optional)",
    error_message: "Sorry, there was an error sending your message. Please try again.",
    validation_missing_fields_message: "Please fill in all required fields before submitting.",
    duplicate_submission_message: "Thank you! We already have your information and will review it again. We'll get back to you soon.",
    // Zadarma Call Widget fields
    call_widget_title: "Call us Now!",
    call_widget_description: "Click the blue button to call us free from anywhere"
  };

  const contactData = contactContent || fallbackContactData;
  const isUsingDirectus = !!contactContent;

  return (
    <>
      <SectionTitle
        title={contactData.main_title}
        {...getEditableAttributes('contact_section', contactData.id, 'main_title')}
      />
      <ZadarmaContactFormMigrated contactData={contactData} isUsingDirectus={isUsingDirectus} />
    </>
  );
};