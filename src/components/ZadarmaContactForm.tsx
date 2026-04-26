"use client";

import React, { useState, useRef, useEffect } from "react";
import { Container } from "./Container";
import {
  EnvelopeIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { ContactContent } from "@/types";
import { getEditableAttributes } from "@/lib/visual-editor";
import { useZadarmaForm } from "@/hooks/useZadarmaForm";

interface ZadarmaContactProps {
  contactData: ContactContent;
  isUsingDirectus: boolean;
}

// Country list without Russia
const COUNTRIES = [
  { code: "UA", name: "Ukraine" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "PL", name: "Poland" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "AT", name: "Austria" },
  { code: "CH", name: "Switzerland" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "CZ", name: "Czech Republic" },
  { code: "SK", name: "Slovakia" },
  { code: "HU", name: "Hungary" },
  { code: "RO", name: "Romania" },
  { code: "BG", name: "Bulgaria" },
  { code: "HR", name: "Croatia" },
  { code: "SI", name: "Slovenia" },
  { code: "LT", name: "Lithuania" },
  { code: "LV", name: "Latvia" },
  { code: "EE", name: "Estonia" },
  { code: "IE", name: "Ireland" },
  { code: "PT", name: "Portugal" },
  { code: "GR", name: "Greece" },
  { code: "CY", name: "Cyprus" },
  { code: "MT", name: "Malta" },
  { code: "LU", name: "Luxembourg" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "SG", name: "Singapore" },
  { code: "HK", name: "Hong Kong" },
  { code: "TW", name: "Taiwan" },
  { code: "IL", name: "Israel" },
  { code: "AE", name: "UAE" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "TR", name: "Turkey" },
  { code: "EG", name: "Egypt" },
  { code: "ZA", name: "South Africa" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "PE", name: "Peru" },
  { code: "IN", name: "India" },
  { code: "CN", name: "China" },
  { code: "TH", name: "Thailand" },
  { code: "VN", name: "Vietnam" },
  { code: "PH", name: "Philippines" },
  { code: "MY", name: "Malaysia" },
  { code: "ID", name: "Indonesia" }
];

const PHONE_TYPES = [
  { value: "mobile", label: "Mobile" },
  { value: "work", label: "Work" },
  { value: "home", label: "Home" },
  { value: "fax", label: "Fax" },
  { value: "other", label: "Other" }
];

const EMAIL_TYPES = [
  { value: "email_work", label: "Work Email" },
  { value: "email_personal", label: "Personal Email" }
];

const CONTACT_TYPES = [
  { value: "skype", label: "Skype" },
  { value: "telegram", label: "Telegram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "viber", label: "Viber" },
  { value: "facebook", label: "Facebook" },
  { value: "vk", label: "VK" },
  { value: "other", label: "Other" }
];

const LEAD_STATUS_OPTIONS = [
  { value: "person", label: "Individual Teacher" },
  { value: "company", label: "School/Company" }
];

export const ZadarmaContactForm = ({ contactData, isUsingDirectus }: ZadarmaContactProps) => {
  const [showValidation, setShowValidation] = useState(false);
  const [fieldValues, setFieldValues] = useState({
    name: '',
    email: '',
    phone: '',
    status: '',
    messengerValue: '',
    country: '',
    website: '',
    message: ''
  });
  const [fieldTypes, setFieldTypes] = useState({
    emailType: 'email_work',
    phoneType: 'mobile',
    messengerType: 'telegram'
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Use the custom Zadarma hook
  const { isSubmitting, submitMessage, submitToZadarma, clearMessage } = useZadarmaForm();

  // Refs for form fields
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const messengerRef = useRef<HTMLInputElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const getBackgroundColors = (hasValue: boolean, isDarkTheme: boolean) => {
    if (isDarkTheme) {
      return hasValue ? '#4B5563' : '#374151';
    } else {
      return hasValue ? '#f0fdf4' : '#f9fafb';
    }
  };


  useEffect(() => {
    const checkTheme = () => {
      if (typeof window !== 'undefined') {
        setIsDark(document.documentElement.classList.contains('dark'));
      }
    };
    checkTheme();
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkTheme();
        }
      });
    });
    if (typeof window !== 'undefined') {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !fieldValues[field as keyof typeof fieldValues].trim());

    if (missingFields.length > 0) {
      setShowValidation(true);
      return;
    }

    // Clear any previous messages
    clearMessage();

    // Submit using the custom hook
    const result = await submitToZadarma(fieldValues, fieldTypes);

    if (result.success) {
      // Reset form on success
      setFieldValues({
        name: '',
        email: '',
        phone: '',
        status: '',
        messengerValue: '',
        country: '',
        website: '',
        message: ''
      });
      setFieldTypes({
        emailType: 'email_work',
        phoneType: 'mobile',
        messengerType: 'telegram'
      });

      // Clear form inputs
      if (nameRef.current) nameRef.current.value = '';
      if (emailRef.current) emailRef.current.value = '';
      if (phoneRef.current) phoneRef.current.value = '';
      if (messengerRef.current) messengerRef.current.value = '';
      if (websiteRef.current) websiteRef.current.value = '';
      if (messageRef.current) messageRef.current.value = '';

      setShowValidation(false);
    }
  };

  // Field value tracking
  useEffect(() => {
    const checkValues = () => {
      const currentValues = {
        name: nameRef.current?.value || '',
        email: emailRef.current?.value || '',
        phone: phoneRef.current?.value || '',
        status: '',
        messengerValue: messengerRef.current?.value || '',
        country: '',
        website: websiteRef.current?.value || '',
        message: messageRef.current?.value || ''
      };
      setFieldValues(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(currentValues)) {
          return currentValues;
        }
        return prev;
      });
    };
    checkValues();
    const interval = setInterval(checkValues, 50);
    const handleAutofillEvents = () => {
      setTimeout(checkValues, 0);
      setTimeout(checkValues, 10);
      setTimeout(checkValues, 100);
    };
    document.addEventListener('focus', handleAutofillEvents);
    document.addEventListener('click', handleAutofillEvents);
    window.addEventListener('pageshow', handleAutofillEvents);
    return () => {
      clearInterval(interval);
      document.removeEventListener('focus', handleAutofillEvents);
      document.removeEventListener('click', handleAutofillEvents);
      window.removeEventListener('pageshow', handleAutofillEvents);
    };
  }, []);

  const getFieldStyle = (fieldName: string, hasValue: boolean, isRequired = false) => {
    const isError = showValidation && isRequired && !hasValue;
    const isFocused = focusedField === fieldName;

    return {
      className: `w-full px-4 py-3 border rounded-lg focus:outline-none text-black dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${
        isError
          ? 'border-red-500 dark:border-red-400 border-2'
          : isFocused
            ? 'border-green-500 dark:border-green-400 border-2'
            : 'border-gray-300 dark:border-gray-600'
      }`,
      style: {
        backgroundColor: getBackgroundColors(hasValue, isDark),
        boxShadow: isFocused
          ? `inset 0 0 0 1000px ${getBackgroundColors(hasValue, isDark)}, inset 0 0 8px rgba(34, 197, 94, 0.4)`
          : `inset 0 0 0 1000px ${getBackgroundColors(hasValue, isDark)}`
      }
    };
  };

  return (
    <Container className="px-4 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-2">
        {/* Contact Information */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl px-8 py-10">
            <h3
              className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center"
              {...(contactData.id ? getEditableAttributes('contact_section', contactData.id, 'contact_info_title') : {})}
            >
              {contactData.contact_info_title}
            </h3>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0" style={{backgroundColor: "#3B82F6"}}>
                  <EnvelopeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4
                    className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1"
                    {...(contactData.id ? getEditableAttributes('contact_section', contactData.id, 'email_label') : {})}
                  >
                    {contactData.email_label}
                  </h4>
                  <Link
                    href={`mailto:${contactData.email_address}`}
                    style={{color: "#3B82F6"}}
                    className="hover:opacity-80"
                    {...(contactData.id ? getEditableAttributes('contact_section', contactData.id, 'email_address') : {})}
                  >
                    {contactData.email_address}
                  </Link>
                </div>
              </div>

              {/* Telegram */}
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full flex-shrink-0">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4
                    className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1"
                    {...(contactData.id ? getEditableAttributes('contact_section', contactData.id, 'telegram_label') : {})}
                  >
                    {contactData.telegram_label}
                  </h4>
                  <Link
                    href={`https://t.me/${contactData.telegram_handle.replace('@', '')}`}
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...(contactData.id ? getEditableAttributes('contact_section', contactData.id, 'telegram_handle') : {})}
                  >
                    {contactData.telegram_handle}
                  </Link>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full flex-shrink-0">
                  <ClockIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4
                    className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1"
                    {...(contactData.id ? getEditableAttributes('contact_section', contactData.id, 'support_hours_label') : {})}
                  >
                    {contactData.support_hours_label}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span
                      className="block"
                      {...(contactData.id ? getEditableAttributes('contact_section', contactData.id, 'support_hours_days') : {})}
                    >
                      {contactData.support_hours_days}
                    </span>
                    <span
                      className="block"
                      {...(contactData.id ? getEditableAttributes('contact_section', contactData.id, 'support_hours_time') : {})}
                    >
                      {contactData.support_hours_time}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl px-8 py-10 shadow-lg dark:shadow-[0_10px_40px_rgba(255,255,255,0.1)]">
            <h3
              className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center"
              {...(contactData.id ? getEditableAttributes('contact_section', contactData.id, 'form_title') : {})}
            >
              {contactData.form_title}
            </h3>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Field 1: Name (required) */}
              <div>
                <input
                  ref={nameRef}
                  type="text"
                  id="name"
                  name="name"
                  required
                  {...getFieldStyle('name', fieldValues.name.trim() !== '', true)}
                  onFocus={(e) => {
                    setFocusedField('name');
                    setFieldValues(prev => ({ ...prev, name: (e.target as HTMLInputElement).value }));
                  }}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => {
                    setFieldValues(prev => ({ ...prev, name: e.target.value }));
                    showValidation && setShowValidation(false);
                  }}
                  onInput={(e) => setFieldValues(prev => ({ ...prev, name: (e.target as HTMLInputElement).value }))}
                  onInvalid={() => setShowValidation(true)}
                  placeholder="Your name"
                />
              </div>

              {/* Field 2: Email (required) with type selection */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <input
                    ref={emailRef}
                    type="email"
                    id="email"
                    name="email"
                    required
                    {...getFieldStyle('email', fieldValues.email.trim() !== '', true)}
                    onChange={(e) => {
                      setFieldValues(prev => ({ ...prev, email: e.target.value }));
                      showValidation && setShowValidation(false);
                    }}
                    onInput={(e) => setFieldValues(prev => ({ ...prev, email: (e.target as HTMLInputElement).value }))}
                    onFocus={(e) => {
                      setFocusedField('email');
                      setFieldValues(prev => ({ ...prev, email: (e.target as HTMLInputElement).value }));
                    }}
                    onBlur={() => setFocusedField(null)}
                    onInvalid={() => setShowValidation(true)}
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <select
                    value={fieldTypes.emailType}
                    onChange={(e) => setFieldTypes(prev => ({ ...prev, emailType: e.target.value }))}
                    className="w-full px-3 py-3 border rounded-lg focus:outline-none text-black dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    style={{
                      backgroundColor: getBackgroundColors(true, isDark)
                    }}
                  >
                    {EMAIL_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field 3: Phone (required) with type selection */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <input
                    ref={phoneRef}
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    {...getFieldStyle('phone', fieldValues.phone.trim() !== '', true)}
                    onChange={(e) => {
                      setFieldValues(prev => ({ ...prev, phone: e.target.value }));
                      showValidation && setShowValidation(false);
                    }}
                    onInput={(e) => setFieldValues(prev => ({ ...prev, phone: (e.target as HTMLInputElement).value }))}
                    onFocus={(e) => {
                      setFocusedField('phone');
                      setFieldValues(prev => ({ ...prev, phone: (e.target as HTMLInputElement).value }));
                    }}
                    onBlur={() => setFocusedField(null)}
                    onInvalid={() => setShowValidation(true)}
                    placeholder="Your phone in international format e.g. +380XXXXXXXXX"
                  />
                </div>
                <div>
                  <select
                    value={fieldTypes.phoneType}
                    onChange={(e) => setFieldTypes(prev => ({ ...prev, phoneType: e.target.value }))}
                    className="w-full px-3 py-3 border rounded-lg focus:outline-none text-black dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    style={{
                      backgroundColor: getBackgroundColors(true, isDark)
                    }}
                  >
                    {PHONE_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field 4: Status (not required) */}
              <div>
                <select
                  value={fieldValues.status}
                  onChange={(e) => setFieldValues(prev => ({ ...prev, status: e.target.value }))}
                  {...getFieldStyle('status', fieldValues.status !== '', false)}
                  onFocus={() => setFocusedField('status')}
                  onBlur={() => setFocusedField(null)}
                >
                  <option value="">Select type (optional)</option>
                  {LEAD_STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Field 5: Messenger/Social (not required) with type selection */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <input
                    ref={messengerRef}
                    type="text"
                    id="messenger"
                    name="messenger"
                    {...getFieldStyle('messenger', fieldValues.messengerValue.trim() !== '', false)}
                    onChange={(e) => setFieldValues(prev => ({ ...prev, messengerValue: e.target.value }))}
                    onInput={(e) => setFieldValues(prev => ({ ...prev, messengerValue: (e.target as HTMLInputElement).value }))}
                    onFocus={(e) => {
                      setFocusedField('messenger');
                      setFieldValues(prev => ({ ...prev, messengerValue: (e.target as HTMLInputElement).value }));
                    }}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Messenger handle or social profile (optional)"
                  />
                </div>
                <div>
                  <select
                    value={fieldTypes.messengerType}
                    onChange={(e) => setFieldTypes(prev => ({ ...prev, messengerType: e.target.value }))}
                    className="w-full px-3 py-3 border rounded-lg focus:outline-none text-black dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    style={{
                      backgroundColor: getBackgroundColors(true, isDark)
                    }}
                  >
                    {CONTACT_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field 6: Country (not required) */}
              <div>
                <select
                  value={fieldValues.country}
                  onChange={(e) => setFieldValues(prev => ({ ...prev, country: e.target.value }))}
                  {...getFieldStyle('country', fieldValues.country !== '', false)}
                  onFocus={() => setFocusedField('country')}
                  onBlur={() => setFocusedField(null)}
                >
                  <option value="">Select Your Country (optional)</option>
                  {COUNTRIES.map(country => (
                    <option key={country.code} value={country.code}>{country.name}</option>
                  ))}
                </select>
              </div>

              {/* Field 7: Website (not required) */}
              <div>
                <input
                  ref={websiteRef}
                  type="url"
                  id="website"
                  name="website"
                  {...getFieldStyle('website', fieldValues.website.trim() !== '', false)}
                  onChange={(e) => setFieldValues(prev => ({ ...prev, website: e.target.value }))}
                  onInput={(e) => setFieldValues(prev => ({ ...prev, website: (e.target as HTMLInputElement).value }))}
                  onFocus={(e) => {
                    setFocusedField('website');
                    setFieldValues(prev => ({ ...prev, website: (e.target as HTMLInputElement).value }));
                  }}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Company or personal website (optional)"
                />
              </div>

              {/* Field 9: Comment/Message (not required) */}
              <div>
                <textarea
                  ref={messageRef}
                  id="message"
                  name="message"
                  rows={3}
                  {...getFieldStyle('message', fieldValues.message.trim() !== '', false)}
                  onChange={(e) => setFieldValues(prev => ({ ...prev, message: e.target.value }))}
                  onInput={(e) => setFieldValues(prev => ({ ...prev, message: (e.target as HTMLTextAreaElement).value }))}
                  onFocus={(e) => {
                    setFocusedField('message');
                    setFieldValues(prev => ({ ...prev, message: (e.target as HTMLTextAreaElement).value }));
                  }}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Tell us more about your question or how we can help..."
                  className="resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 text-white rounded-lg hover:opacity-90 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                style={{backgroundColor: "#3B82F6"}}
              >
                {isSubmitting ? 'Sending...' : (contactData.submit_button_text || 'Send Message')}
              </button>

              {/* Submit Message */}
              {submitMessage && (
                <div className={`text-center p-3 rounded-lg ${
                  submitMessage.includes('error') || submitMessage.includes('Sorry')
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                }`}>
                  {submitMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};