import { Container } from "./Container";
import { SectionTitle } from "./SectionTitle";
import {
  EnvelopeIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

export const Contact = () => {
  return (
    <Container className="px-8">
      <SectionTitle
        title="Ways to Reach Us"
      >
      </SectionTitle>

      <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-2">
        {/* Contact Information */}
        <div className="lg:col-span-1">
          <div className="bg-gray-100 rounded-2xl px-8 py-10 dark:bg-trueGray-800">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
              Contact Information
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
                    href="mailto:info@tamamat.com"
                    style={{color: "#3B82F6"}}
                    className="hover:opacity-80"
                  >
                    info@tamamat.com
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
                    href="https://t.me/tamamatinfo"
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @tamamatinfo
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
                    Monday - Friday<br />
                    9:00 AM - 5:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-600">
              <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 text-center">
                Follow Us
              </h4>
              <div className="flex justify-center space-x-4">
                <Link
                  href="https://twitter.com/tamamat"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link
                  href="https://facebook.com/tamamat"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link
                  href="https://instagram.com/tamamat"
                  className="text-gray-400 hover:text-pink-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">Instagram</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.017 0C8.396 0 7.929.01 6.71.058 5.487.107 4.677.277 3.982.559a5.8 5.8 0 00-2.09 1.362 5.8 5.8 0 00-1.363 2.09C.296 4.677.126 5.487.077 6.71.03 7.929.02 8.396.02 12.017c0 3.624.01 4.09.058 5.31.049 1.223.219 2.033.501 2.728a5.8 5.8 0 001.362 2.09 5.8 5.8 0 002.09 1.362c.695.282 1.505.452 2.728.501 1.22.048 1.687.058 5.31.058 3.624 0 4.09-.01 5.31-.058 1.223-.049 2.033-.219 2.728-.501a5.8 5.8 0 002.09-1.362 5.8 5.8 0 001.362-2.09c.282-.695.452-1.505.501-2.728.048-1.22.058-1.687.058-5.31 0-3.624-.01-4.09-.058-5.31-.049-1.223-.219-2.033-.501-2.728a5.8 5.8 0 00-1.362-2.09A5.8 5.8 0 0020.738.558c-.695-.282-1.505-.452-2.728-.501C16.79.01 16.324.02 12.699.02h-.682zm-.09 2.17c.36-.003.724-.003 1.095-.003 3.567 0 3.99.01 5.198.056 1.255.058 1.937.27 2.391.449.6.233 1.03.512 1.48.962.45.45.729.88.962 1.48.179.454.391 1.136.449 2.391.046 1.208.056 1.631.056 5.198 0 3.567-.01 3.99-.056 5.198-.058 1.255-.27 1.937-.449 2.391a3.967 3.967 0 01-.962 1.48c-.45.45-.88.729-1.48.962-.454.179-1.136.391-2.391.449-1.208.046-1.631.056-5.198.056-3.567 0-3.99-.01-5.198-.056-1.255-.058-1.937-.27-2.391-.449a3.967 3.967 0 01-1.48-.962 3.967 3.967 0 01-.962-1.48c-.179-.454-.391-1.136-.449-2.391-.046-1.208-.056-1.631-.056-5.198 0-3.567.01-3.99.056-5.198.058-1.255.27-1.937.449-2.391.233-.6.512-1.03.962-1.48a3.967 3.967 0 011.48-.962c.454-.179 1.136-.391 2.391-.449 1.208-.046 1.631-.056 5.198-.056l.004-.002zm7.402 2.16a1.443 1.443 0 11-2.886 0 1.443 1.443 0 012.886 0zm-7.402.901a6.127 6.127 0 100 12.253 6.127 6.127 0 000-12.253zm0 2.17a3.957 3.957 0 110 7.914 3.957 3.957 0 010-7.914z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link
                  href="https://linkedin.com/company/tamamat"
                  className="text-gray-400 hover:text-blue-700 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-1">
          <div className="bg-gray-100 rounded-2xl px-8 py-10 dark:bg-trueGray-800">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
              Send Us a Message
            </h3>

            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-trueGray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-trueGray-700 dark:border-gray-600 dark:text-white"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-trueGray-700 dark:border-gray-600 dark:text-white"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-trueGray-700 dark:border-gray-600 dark:text-white resize-none"
                  placeholder="Tell us more about your question or how we can help..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 text-white rounded-lg hover:opacity-90 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                style={{backgroundColor: "#3B82F6"}}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};