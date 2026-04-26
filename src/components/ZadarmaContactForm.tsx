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

// Comprehensive country list (alphabetical, excluding Russia and North Korea)
const COUNTRIES = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BR", name: "Brazil" },
  { code: "BN", name: "Brunei" },
  { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "CV", name: "Cabo Verde" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "KM", name: "Comoros" },
  { code: "CG", name: "Congo" },
  { code: "CR", name: "Costa Rica" },
  { code: "CI", name: "Côte d'Ivoire" },
  { code: "HR", name: "Croatia" },
  { code: "CU", name: "Cuba" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "CD", name: "Democratic Republic of the Congo" },
  { code: "DK", name: "Denmark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominica" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "EE", name: "Estonia" },
  { code: "SZ", name: "Eswatini" },
  { code: "ET", name: "Ethiopia" },
  { code: "FJ", name: "Fiji" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GR", name: "Greece" },
  { code: "GD", name: "Grenada" },
  { code: "GT", name: "Guatemala" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haiti" },
  { code: "HN", name: "Honduras" },
  { code: "HK", name: "Hong Kong" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KI", name: "Kiribati" },
  { code: "KW", name: "Kuwait" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "LA", name: "Laos" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LS", name: "Lesotho" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libya" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MO", name: "Macao" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MH", name: "Marshall Islands" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "MX", name: "Mexico" },
  { code: "FM", name: "Micronesia" },
  { code: "MD", name: "Moldova" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" },
  { code: "NA", name: "Namibia" },
  { code: "NR", name: "Nauru" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria" },
  { code: "MK", name: "North Macedonia" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palau" },
  { code: "PS", name: "Palestine" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" },
  { code: "RO", name: "Romania" },
  { code: "RW", name: "Rwanda" },
  { code: "KN", name: "Saint Kitts and Nevis" },
  { code: "LC", name: "Saint Lucia" },
  { code: "VC", name: "Saint Vincent and the Grenadines" },
  { code: "WS", name: "Samoa" },
  { code: "SM", name: "San Marino" },
  { code: "ST", name: "São Tomé and Príncipe" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" },
  { code: "RS", name: "Serbia" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapore" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "SB", name: "Solomon Islands" },
  { code: "SO", name: "Somalia" },
  { code: "ZA", name: "South Africa" },
  { code: "KR", name: "South Korea" },
  { code: "SS", name: "South Sudan" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SD", name: "Sudan" },
  { code: "SR", name: "Suriname" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "SY", name: "Syria" },
  { code: "TW", name: "Taiwan" },
  { code: "TJ", name: "Tajikistan" },
  { code: "TZ", name: "Tanzania" },
  { code: "TH", name: "Thailand" },
  { code: "TL", name: "Timor-Leste" },
  { code: "TG", name: "Togo" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" },
  { code: "TM", name: "Turkmenistan" },
  { code: "TV", name: "Tuvalu" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "UY", name: "Uruguay" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VU", name: "Vanuatu" },
  { code: "VA", name: "Vatican City" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Vietnam" },
  { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" }
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
  { value: "", label: "Specify your favorite messenger" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telegram", label: "Telegram" },
  { value: "facebook", label: "Facebook Messenger" },
  { value: "instagram", label: "Instagram" },
  { value: "viber", label: "Viber" },
  { value: "signal", label: "Signal" },
  { value: "line", label: "LINE" },
  { value: "wechat", label: "WeChat" },
  { value: "skype", label: "Skype" },
  { value: "other", label: "Other" }
];

const LEAD_STATUS_OPTIONS = [
  { value: "person", label: "Teacher" },
  { value: "company", label: "School" }
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
    emailType: 'email_work', // Fixed to work email
    phoneType: 'mobile', // Fixed to mobile
    messengerType: ''
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
        messengerType: ''
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
        status: fieldValues.status, // Keep existing status value from state
        messengerValue: messengerRef.current?.value || '',
        country: fieldValues.country, // Keep existing country value from state
        website: websiteRef.current?.value || '',
        message: messageRef.current?.value || ''
      };
      setFieldValues(prev => {
        // Only update if the input fields changed, preserve select/radio state
        const hasInputChanges =
          prev.name !== currentValues.name ||
          prev.email !== currentValues.email ||
          prev.phone !== currentValues.phone ||
          prev.messengerValue !== currentValues.messengerValue ||
          prev.website !== currentValues.website ||
          prev.message !== currentValues.message;

        if (hasInputChanges) {
          return { ...prev, ...currentValues };
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
  }, [fieldValues.status, fieldValues.country]);

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

              {/* Field 2: Email (required) */}
              <div>
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

              {/* Field 3: Phone (required) */}
              <div>
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

              {/* Field 4: Status (not required) - Radio buttons */}
              <div className="flex justify-center gap-8">
                {LEAD_STATUS_OPTIONS.map(option => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={fieldValues.status === option.value}
                      onChange={(e) => setFieldValues(prev => ({ ...prev, status: e.target.value }))}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="ml-2 text-base font-medium text-gray-500 dark:text-gray-400">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>

              {/* Field 5: Messenger/Social (not required) with type selection */}
              <div className="space-y-3">
                <div>
                  <select
                    value={fieldTypes.messengerType}
                    onChange={(e) => setFieldTypes(prev => ({ ...prev, messengerType: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none text-gray-500 dark:text-gray-400 placeholder-gray-500 dark:placeholder-gray-400 ${
                      focusedField === 'messengerType'
                        ? 'border-green-500 dark:border-green-400 border-2'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{
                      backgroundColor: getBackgroundColors(fieldTypes.messengerType !== '', isDark),
                      boxShadow: focusedField === 'messengerType'
                        ? `inset 0 0 0 1000px ${getBackgroundColors(fieldTypes.messengerType !== '', isDark)}, inset 0 0 8px rgba(34, 197, 94, 0.4)`
                        : `inset 0 0 0 1000px ${getBackgroundColors(fieldTypes.messengerType !== '', isDark)}`
                    }}
                    onFocus={() => setFocusedField('messengerType')}
                    onBlur={() => setFocusedField(null)}
                  >
                    {CONTACT_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
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
                    placeholder="Username or phone number associated with the messenger"
                  />
                </div>
              </div>

              {/* Field 6: Country (not required) */}
              <div>
                <select
                  value={fieldValues.country}
                  onChange={(e) => setFieldValues(prev => ({ ...prev, country: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none text-gray-500 dark:text-gray-400 placeholder-gray-500 dark:placeholder-gray-400 ${
                    focusedField === 'country'
                      ? 'border-green-500 dark:border-green-400 border-2'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  style={{
                    backgroundColor: getBackgroundColors(fieldValues.country !== '', isDark),
                    boxShadow: focusedField === 'country'
                      ? `inset 0 0 0 1000px ${getBackgroundColors(fieldValues.country !== '', isDark)}, inset 0 0 8px rgba(34, 197, 94, 0.4)`
                      : `inset 0 0 0 1000px ${getBackgroundColors(fieldValues.country !== '', isDark)}`
                  }}
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none text-black dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none ${
                    showValidation && fieldValues.message.trim() === ''
                      ? 'border-red-500 dark:border-red-400 border-2'
                      : focusedField === 'message'
                        ? 'border-green-500 dark:border-green-400 border-2'
                        : 'border-gray-300 dark:border-gray-600'
                  }`}
                  style={{
                    backgroundColor: getBackgroundColors(fieldValues.message.trim() !== '', isDark),
                    boxShadow: focusedField === 'message'
                      ? `inset 0 0 0 1000px ${getBackgroundColors(fieldValues.message.trim() !== '', isDark)}, inset 0 0 8px rgba(34, 197, 94, 0.4)`
                      : `inset 0 0 0 1000px ${getBackgroundColors(fieldValues.message.trim() !== '', isDark)}`
                  }}
                  onChange={(e) => {
                    setFieldValues(prev => ({ ...prev, message: e.target.value }));
                    showValidation && setShowValidation(false);
                  }}
                  onInput={(e) => setFieldValues(prev => ({ ...prev, message: (e.target as HTMLTextAreaElement).value }))}
                  onFocus={(e) => {
                    setFocusedField('message');
                    setFieldValues(prev => ({ ...prev, message: (e.target as HTMLTextAreaElement).value }));
                  }}
                  onBlur={() => setFocusedField(null)}
                  onInvalid={() => setShowValidation(true)}
                  placeholder="Tell us more about your question or how we can help..."
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