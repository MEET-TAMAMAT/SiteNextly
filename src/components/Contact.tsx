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

interface ContactProps {
  contactData: ContactContent;
  isUsingDirectus: boolean;
}

export const ContactClient = ({ contactData, isUsingDirectus }: ContactProps) => {
  const [showValidation, setShowValidation] = useState(false);
  const [fieldValues, setFieldValues] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // Helper function to get theme-aware background colors
  const getBackgroundColors = (hasValue: boolean, isDarkTheme: boolean) => {
    if (isDarkTheme) {
      return hasValue ? '#4B5563' : '#374151'; // gray-600 : gray-700
    } else {
      return hasValue ? '#f0fdf4' : '#f9fafb'; // light green : light gray
    }
  };

  // Watch for theme changes
  useEffect(() => {
    const checkTheme = () => {
      if (typeof window !== 'undefined') {
        setIsDark(document.documentElement.classList.contains('dark'));
      }
    };

    // Check theme on mount
    checkTheme();

    // Watch for theme changes using MutationObserver
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowValidation(true);
  };

  // Sync state with actual field values to handle autofill
  useEffect(() => {
    const checkValues = () => {
      const currentValues = {
        name: nameRef.current?.value || '',
        email: emailRef.current?.value || '',
        subject: subjectRef.current?.value || '',
        message: messageRef.current?.value || ''
      };

      setFieldValues(prev => {
        if (
          prev.name !== currentValues.name ||
          prev.email !== currentValues.email ||
          prev.subject !== currentValues.subject ||
          prev.message !== currentValues.message
        ) {
          return currentValues;
        }
        return prev;
      });
    };

    // Check immediately and periodically
    checkValues();
    const interval = setInterval(checkValues, 50); // More frequent checking

    // Also check on various events that might indicate autofill
    const handleAutofillEvents = () => {
      setTimeout(checkValues, 0);
      setTimeout(checkValues, 10);
      setTimeout(checkValues, 100);
    };

    // Add event listeners to detect autofill
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

  return (
    <Container className="px-4 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-2">
        {/* Contact Information */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl px-8 py-10">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
              {contactData.contact_info_title}
            </h3>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0" style={{backgroundColor: "#3B82F6"}}>
                  <EnvelopeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
                    Email
                  </h4>
                  <Link
                    href={`mailto:${contactData.email_address}`}
                    style={{color: "#3B82F6"}}
                    className="hover:opacity-80"
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
                  <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
                    Telegram
                  </h4>
                  <Link
                    href={`https://t.me/${contactData.telegram_handle.replace('@', '')}`}
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
                    target="_blank"
                    rel="noopener noreferrer"
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
                  <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
                    Support Hours
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {contactData.support_hours_days}<br />
                    {contactData.support_hours_time}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl px-8 py-10 shadow-lg dark:shadow-[0_10px_40px_rgba(255,255,255,0.1)]">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
              {contactData.form_title}
            </h3>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <input
                  ref={nameRef}
                  type="text"
                  id="name"
                  name="name"
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none text-black dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${
                    showValidation && fieldValues.name.trim() === ''
                      ? 'border-red-500 dark:border-red-400 border-2'
                      : focusedField === 'name'
                        ? 'border-green-500 dark:border-green-400 border-2'
                        : 'border-gray-300 dark:border-gray-600'
                  }`}
                  style={{
                    backgroundColor: getBackgroundColors(fieldValues.name.trim() !== '', isDark),
                    boxShadow: focusedField === 'name'
                      ? `inset 0 0 0 1000px ${getBackgroundColors(fieldValues.name.trim() !== '', isDark)}, inset 0 0 8px rgba(34, 197, 94, 0.4)`
                      : `inset 0 0 0 1000px ${getBackgroundColors(fieldValues.name.trim() !== '', isDark)}`
                  }}
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
                  placeholder={contactData.name_field_placeholder}
                />
              </div>

              <div>
                <input
                  ref={emailRef}
                  type="email"
                  id="email"
                  name="email"
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none text-black dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${
                    showValidation && fieldValues.email.trim() === ''
                      ? 'border-red-500 dark:border-red-400 border-2'
                      : focusedField === 'email'
                        ? 'border-green-500 dark:border-green-400 border-2'
                        : 'border-gray-300 dark:border-gray-600'
                  }`}
                  style={{
                    backgroundColor: getBackgroundColors(fieldValues.email.trim() !== '', isDark),
                    boxShadow: focusedField === 'email'
                      ? `inset 0 0 0 1000px ${getBackgroundColors(fieldValues.email.trim() !== '', isDark)}, inset 0 0 8px rgba(34, 197, 94, 0.4)`
                      : `inset 0 0 0 1000px ${getBackgroundColors(fieldValues.email.trim() !== '', isDark)}`
                  }}
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
                  placeholder={contactData.email_field_placeholder}
                />
              </div>

              <div>
                <input
                  ref={subjectRef}
                  type="text"
                  id="subject"
                  name="subject"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none text-black dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${
                    focusedField === 'subject'
                      ? 'border-green-500 dark:border-green-400 border-2'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  style={{
                    backgroundColor: getBackgroundColors(fieldValues.subject.trim() !== '', isDark),
                    boxShadow: focusedField === 'subject'
                      ? `inset 0 0 0 1000px ${getBackgroundColors(fieldValues.subject.trim() !== '', isDark)}, inset 0 0 8px rgba(34, 197, 94, 0.4)`
                      : `inset 0 0 0 1000px ${getBackgroundColors(fieldValues.subject.trim() !== '', isDark)}`
                  }}
                  onChange={(e) => setFieldValues(prev => ({ ...prev, subject: e.target.value }))}
                  onInput={(e) => setFieldValues(prev => ({ ...prev, subject: (e.target as HTMLInputElement).value }))}
                  onFocus={(e) => {
                    setFocusedField('subject');
                    setFieldValues(prev => ({ ...prev, subject: (e.target as HTMLInputElement).value }));
                  }}
                  onBlur={() => setFocusedField(null)}
                  placeholder={contactData.subject_field_placeholder}
                />
              </div>

              <div>
                <textarea
                  ref={messageRef}
                  id="message"
                  name="message"
                  rows={3}
                  required
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
                  placeholder={contactData.message_field_placeholder}
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 text-white rounded-lg hover:opacity-90 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                style={{backgroundColor: "#3B82F6"}}
              >
                {contactData.submit_button_text}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};