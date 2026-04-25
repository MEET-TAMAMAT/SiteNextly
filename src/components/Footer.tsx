import Link from "next/link";
import React from "react";
import { Container } from "@/components/Container";
import { FooterContent } from "@/types";
import { getEditableAttributes } from "@/lib/visual-editor";

interface FooterProps {
  footerData: FooterContent;
  isUsingDirectus: boolean;
}

export function FooterClient({ footerData, isUsingDirectus }: FooterProps) {
  return (
    <div className="border-t border-gray-200 dark:border-trueGray-700">
      <Container>
        <div className="pt-0 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center py-0">

            {/* Social media on the left */}
            <div className="flex items-center mb-0 md:mb-0">
              <div className="flex space-x-4 text-gray-400 dark:text-gray-500">

                {footerData.twitter_enabled && (
                  <a
                    href={footerData.twitter_url}
                    target="_blank"
                    rel="noopener"
                    className="hover:text-blue-500 transition-colors"
                    {...getEditableAttributes('footer_section', footerData.id, 'twitter_url')}
                  >
                    <span className="sr-only">Twitter</span>
                    <Twitter />
                  </a>
                )}

                {footerData.facebook_enabled && (
                  <a
                    href={footerData.facebook_url}
                    target="_blank"
                    rel="noopener"
                    className="hover:text-blue-500 transition-colors"
                    {...getEditableAttributes('footer_section', footerData.id, 'facebook_url')}
                  >
                    <span className="sr-only">Facebook</span>
                    <Facebook />
                  </a>
                )}

                {footerData.instagram_enabled && (
                  <a
                    href={footerData.instagram_url}
                    target="_blank"
                    rel="noopener"
                    className="hover:text-blue-500 transition-colors"
                    {...getEditableAttributes('footer_section', footerData.id, 'instagram_url')}
                  >
                    <span className="sr-only">Instagram</span>
                    <Instagram />
                  </a>
                )}

                {footerData.linkedin_enabled && (
                  <a
                    href={footerData.linkedin_url}
                    target="_blank"
                    rel="noopener"
                    className="hover:text-blue-500 transition-colors"
                    {...getEditableAttributes('footer_section', footerData.id, 'linkedin_url')}
                  >
                    <span className="sr-only">LinkedIn</span>
                    <Linkedin />
                  </a>
                )}

                {footerData.youtube_enabled && (
                  <a
                    href={footerData.youtube_url}
                    target="_blank"
                    rel="noopener"
                    className="hover:text-blue-500 transition-colors"
                    {...getEditableAttributes('footer_section', footerData.id, 'youtube_url')}
                  >
                    <span className="sr-only">YouTube</span>
                    <YouTube />
                  </a>
                )}

                {footerData.tiktok_enabled && (
                  <a
                    href={footerData.tiktok_url}
                    target="_blank"
                    rel="noopener"
                    className="hover:text-blue-500 transition-colors"
                    {...getEditableAttributes('footer_section', footerData.id, 'tiktok_url')}
                  >
                    <span className="sr-only">TikTok</span>
                    <TikTok />
                  </a>
                )}

              </div>
            </div>

            {/* Copyright on the right */}
            <div
              className="text-xs text-gray-600 dark:text-gray-400 text-center mt-2"
              style={{fontFamily: "var(--font-nunito), sans-serif"}}
              {...getEditableAttributes('footer_section', footerData.id, 'copyright_text')}
            >
              {footerData.copyright_text}
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
}

const Twitter = ({ size = 30 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Facebook = ({ size = 30 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07" />
  </svg>
);

const Instagram = ({ size = 30 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.98 0a6.9 6.9 0 0 1 5.08 1.98A6.94 6.94 0 0 1 24 7.02v9.96c0 2.08-.68 3.87-1.98 5.13A7.14 7.14 0 0 1 16.94 24H7.06a7.06 7.06 0 0 1-5.03-1.89A6.96 6.96 0 0 1 0 16.94V7.02C0 2.8 2.8 0 7.02 0h9.96zm.05 2.23H7.06c-1.45 0-2.7.43-3.53 1.25a4.82 4.82 0 0 0-1.3 3.54v9.92c0 1.5.43 2.7 1.3 3.58a5 5 0 0 0 3.53 1.25h9.88a5 5 0 0 0 3.53-1.25 4.73 4.73 0 0 0 1.4-3.54V7.02a5 5 0 0 0-1.3-3.49 4.82 4.82 0 0 0-3.54-1.3zM12 5.76c3.39 0 6.2 2.8 6.2 6.2a6.2 6.2 0 0 1-12.4 0 6.2 6.2 0 0 1 6.2-6.2zm0 2.22a3.99 3.99 0 0 0-3.97 3.97A3.99 3.99 0 0 0 12 15.92a3.99 3.99 0 0 0 3.97-3.97A3.99 3.99 0 0 0 12 7.98zm6.44-3.77a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z" />
  </svg>
);

const Linkedin = ({ size = 30 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.27 20.1H3.65V9.24h3.62V20.1zM5.47 7.76h-.03c-1.22 0-2-.83-2-1.87 0-1.06.8-1.87 2.05-1.87 1.24 0 2 .8 2.02 1.87 0 1.04-.78 1.87-2.05 1.87zM20.34 20.1h-3.63v-5.8c0-1.45-.52-2.45-1.83-2.45-1 0-1.6.67-1.87 1.32-.1.23-.11.55-.11.88v6.05H9.28s.05-9.82 0-10.84h3.63v1.54a3.6 3.6 0 0 1 3.26-1.8c2.39 0 4.18 1.56 4.18 4.89v6.21z" />
  </svg>
);

const YouTube = ({ size = 30 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TikTok = ({ size = 30 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
  </svg>
);
