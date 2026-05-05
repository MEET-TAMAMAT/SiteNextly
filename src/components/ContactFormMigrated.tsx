"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container } from "./Container";
import {
  EnvelopeIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { ContactContent } from "@/types";
import { getEditableAttributes } from "@/lib/visual-editor";
import { NotificationModal } from "./NotificationModal";
import { contactFormSchema, ContactFormData } from "@/lib/validation/contact-form";
import { Turnstile } from '@marsidev/react-turnstile';
import { ZadarmaWidget } from './ZadarmaWidget';

interface ZadarmaContactProps {
  contactData: ContactContent;
  isUsingDirectus: boolean;
}

// Keep your existing country and contact type arrays (unchanged)
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

const CONTACT_TYPES = [
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

export const ZadarmaContactFormMigrated = ({ contactData, isUsingDirectus }: ZadarmaContactProps) => {
  // Dynamic status options from Directus (unchanged)
  const LEAD_STATUS_OPTIONS = [
    { value: "person", label: contactData.lead_status_teacher_label },
    { value: "company", label: contactData.lead_status_school_label }
  ];

  // react-hook-form setup with Zod validation
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    clearErrors
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      leadType: 'person', // Default to Teacher
      name: '',
      email: '',
      phone: '',
      company: '',
      website: '',
      message: '',
      country: '',
      messengerType: '',
      messengerHandle: '',
    },
    mode: 'onBlur', // Validate on blur for better UX
  });

  // Watch leadType for conditional rendering
  const leadType = watch('leadType');
  const messengerType = watch('messengerType');

  // Modal state (unchanged)
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'validation';
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    message: ''
  });

  const [isDark, setIsDark] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>('');

  // UTM params (unchanged logic)
  const [utmParams, setUtmParams] = useState({
    utm_source: 'direct',
    utm_medium: 'none',
    utm_campaign: 'none',
    utm_content: 'none',
    utm_term: 'none',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtmParams({
      utm_source: params.get('utm_source') || 'direct',
      utm_medium: params.get('utm_medium') || 'none',
      utm_campaign: params.get('utm_campaign') || 'none',
      utm_content: params.get('utm_content') || 'none',
      utm_term: params.get('utm_term') || 'none',
    });
  }, []);

  // Theme detection (unchanged)
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

  // Form submission with react-hook-form
  const onSubmit = async (data: ContactFormData) => {
    try {
      // Verify CAPTCHA token
      if (!turnstileToken) {
        setModalState({
          isOpen: true,
          type: 'validation',
          message: 'Please complete the CAPTCHA verification'
        });
        return;
      }

      // Transform website URL - add https:// if it's just a domain
      let transformedWebsite = data.website?.trim() || '';
      if (transformedWebsite && !transformedWebsite.match(/^https?:\/\//i)) {
        transformedWebsite = `https://${transformedWebsite}`;
      }

      // Combine form data with UTM params and CAPTCHA token
      const submitData = {
        ...data,
        website: transformedWebsite,
        'cf-turnstile-response': turnstileToken,
        ...utmParams
      };

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Submission failed');
      }

      // Show success modal
      setModalState({
        isOpen: true,
        type: 'success',
        message: contactData.success_message
      });

      // Reset form and CAPTCHA token
      reset();
      setTurnstileToken('');

    } catch (err) {
      console.error('Form submission error:', err);
      setModalState({
        isOpen: true,
        type: 'error',
        message: contactData.error_message
      });
    }
  };

  // Field styling function (simplified)
  const getFieldStyle = (fieldName: string, hasValue: boolean, hasError: boolean = false) => {
    return {
      className: `w-full px-4 py-3 border rounded-lg focus:outline-none text-black dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${
        hasError
          ? 'border-red-500 dark:border-red-400 border-2'
          : 'border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400'
      }`,
      style: {
        backgroundColor: getBackgroundColors(hasValue, isDark),
      }
    };
  };

  return (
    <Container className="px-4 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-2">
        {/* Contact Information (unchanged) */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl px-8 py-10">
            <h3
              className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center"
              {...(contactData.id ? getEditableAttributes('contact_section', contactData.id, 'contact_info_title') : {})}
            >
              {contactData.contact_info_title}
            </h3>

            <div className="space-y-6">
              {/* Zadarma Click to Call Widget */}
              <ZadarmaWidget contactData={contactData} isUsingDirectus={isUsingDirectus} />

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

        {/* Contact Form - NEW react-hook-form version */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl px-8 py-10 shadow-lg dark:shadow-[0_10px_40px_rgba(255,255,255,0.1)]">
            <div className="mb-8">
              <h3
                className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center"
                {...(contactData.id ? getEditableAttributes('contact_section', contactData.id, 'form_title') : {})}
              >
                {contactData.form_title}
              </h3>

              {/* Lead Type Radio Buttons */}
              <div className="flex justify-center gap-8 mb-8">
                {LEAD_STATUS_OPTIONS.map(option => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      {...register('leadType')}
                      type="radio"
                      value={option.value}
                      className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ${
                        errors.leadType ? 'border-red-500 dark:border-red-400' : ''
                      }`}
                    />
                    <span
                      className="ml-2 text-base font-medium"
                      style={{ color: "#3B82F6" }}
                      {...(contactData.id ? getEditableAttributes('contact_section', contactData.id, option.value === 'person' ? 'lead_status_teacher_label' : 'lead_status_school_label') : {})}
                    >
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.leadType && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">
                  {errors.leadType.message}
                </div>
              )}
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                {/* Company Name - Conditional for Schools */}
                {leadType === 'company' && (
                  <div>
                    <input
                      {...register('company')}
                      type="text"
                      placeholder={contactData.company_field_placeholder}
                      {...getFieldStyle('company', (watch('company') || '').length > 0, !!errors.company)}
                      {...(contactData.id ? getEditableAttributes('contact_section', contactData.id, 'company_field_placeholder') : {})}
                    />
                    {errors.company && (
                      <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.company.message}
                      </div>
                    )}
                  </div>
                )}

                {/* Contact Name */}
                <div>
                  <input
                    {...register('name')}
                    type="text"
                    placeholder={contactData.name_field_placeholder}
                    {...getFieldStyle('name', (watch('name') || '').length > 0, !!errors.name)}
                    {...(contactData.id ? getEditableAttributes('contact_section', contactData.id, 'name_field_placeholder') : {})}
                  />
                  {errors.name && (
                    <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.name.message}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder={contactData.email_field_placeholder}
                    {...getFieldStyle('email', (watch('email') || '').length > 0, !!errors.email)}
                    {...(contactData.id ? getEditableAttributes('contact_section', contactData.id, 'email_field_placeholder') : {})}
                  />
                  {errors.email && (
                    <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.email.message}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder={contactData.phone_field_placeholder}
                    {...getFieldStyle('phone', (watch('phone') || '').length > 0, !!errors.phone)}
                    {...(contactData.id ? getEditableAttributes('contact_section', contactData.id, 'phone_field_placeholder') : {})}
                  />
                  {errors.phone && (
                    <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.phone.message}
                    </div>
                  )}
                </div>

                {/* Country */}
                <div>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none text-gray-500 dark:text-gray-400 placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400`}
                        style={{
                          backgroundColor: getBackgroundColors(field.value !== '', isDark),
                        }}
                        {...(contactData.id ? getEditableAttributes('contact_section', contactData.id, 'country_field_placeholder') : {})}
                      >
                        <option value="">{contactData.country_field_placeholder}</option>
                        {COUNTRIES.map(country => (
                          <option key={country.code} value={country.code}>{country.name}</option>
                        ))}
                      </select>
                    )}
                  />
                </div>

                {/* Conditional Teacher Fields */}
                {leadType === 'person' && (
                  <>
                    {/* Messenger Type */}
                    <div>
                      <Controller
                        name="messengerType"
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none text-gray-500 dark:text-gray-400 placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400`}
                            style={{
                              backgroundColor: getBackgroundColors(field.value !== '', isDark),
                            }}
                            {...(contactData.id ? getEditableAttributes('contact_section', contactData.id, 'messenger_dropdown_placeholder') : {})}
                          >
                            <option value="">{contactData.messenger_dropdown_placeholder}</option>
                            {CONTACT_TYPES.map(type => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                        )}
                      />
                    </div>

                    {/* Messenger Handle - only show if messenger type is selected */}
                    {messengerType && (
                      <div>
                        <input
                          {...register('messengerHandle')}
                          type="text"
                          placeholder={contactData.messenger_field_placeholder}
                          {...getFieldStyle('messengerHandle', (watch('messengerHandle') || '').length > 0, !!errors.messengerHandle)}
                          {...(contactData.id ? getEditableAttributes('contact_section', contactData.id, 'messenger_field_placeholder') : {})}
                        />
                        {errors.messengerHandle && (
                          <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.messengerHandle.message}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* School Website Field */}
                {leadType === 'company' && (
                  <div>
                    <input
                      {...register('website')}
                      type="text"
                      placeholder={contactData.website_field_placeholder}
                      {...getFieldStyle('website', (watch('website') || '').length > 0, !!errors.website)}
                      {...(contactData.id ? getEditableAttributes('contact_section', contactData.id, 'website_field_placeholder') : {})}
                    />
                    {errors.website && (
                      <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.website.message}
                      </div>
                    )}
                  </div>
                )}

                {/* Message */}
                <div>
                  <textarea
                    {...register('message')}
                    rows={3}
                    placeholder={contactData.message_field_placeholder}
                    {...getFieldStyle('message', (watch('message') || '').length > 0, !!errors.message)}
                    {...(contactData.id ? getEditableAttributes('contact_section', contactData.id, 'message_field_placeholder') : {})}
                  />
                  {errors.message && (
                    <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.message.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Cloudflare Turnstile CAPTCHA */}
              <div className="flex justify-center">
                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => setTurnstileToken('')}
                  onExpire={() => setTurnstileToken('')}
                  options={{
                    theme: isDark ? 'dark' : 'light',
                    retry: 'auto'
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 text-white rounded-lg hover:opacity-90 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                style={{backgroundColor: "#3B82F6"}}
                {...(contactData.id ? getEditableAttributes('contact_section', contactData.id, 'submit_button_text') : {})}
              >
                {isSubmitting ? 'Sending...' : (contactData.submit_button_text || 'Send Message')}
              </button>

              {/* Notification Modal */}
              <NotificationModal
                isOpen={modalState.isOpen}
                type={modalState.type}
                message={modalState.message}
                autoCloseMs={modalState.type === 'success' ? 3000 : 0}
                onClose={() => setModalState({ isOpen: false, type: 'success', message: '' })}
              />
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};