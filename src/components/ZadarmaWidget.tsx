"use client";

import React, { useEffect } from 'react';
import { ContactContent } from '@/types';
import { getEditableAttributes } from '@/lib/visual-editor';

interface ZadarmaWidgetProps {
  contactData: ContactContent;
  isUsingDirectus: boolean;
}

export const ZadarmaWidget = ({ contactData, isUsingDirectus }: ZadarmaWidgetProps) => {
  useEffect(() => {
    // Add immediate console log to confirm component is loading (client-side only)
    console.log('🚀 ZadarmaWidget component is mounting!');
    console.log('🚀 Current URL:', window.location.href);
    console.log('🚀 Window object available:', typeof window !== 'undefined');
    console.log('🚀 ZadarmaWidget useEffect is running!');
    let retryCount = 0;
    const maxRetries = 50;

    const checkAndInitialize = () => {
      retryCount++;
      console.log(`🔍 Zadarma check attempt ${retryCount}/${maxRetries}`);

      // Check if all required scripts are loaded
      console.log('📋 Script availability check:');
      console.log('- ZadarmaCallmeWidget:', typeof (window as any).ZadarmaCallmeWidget);
      console.log('- detectRTC:', typeof (window as any).DetectRTC);
      console.log('- JsSIP:', typeof (window as any).JsSIP);

      // Check if DOM element exists
      const domElement = document.getElementById('myZadarmaCallmeWidget18460');
      console.log('- DOM element found:', !!domElement);

      if (typeof (window as any).ZadarmaCallmeWidget !== 'undefined' && domElement) {
        console.log('✅ All requirements met, initializing widget...');

        try {
          // Clear the element first
          domElement.innerHTML = '';

          // Create widget
          console.log('🔧 Creating ZadarmaCallmeWidget...');
          const widget = new (window as any).ZadarmaCallmeWidget("myZadarmaCallmeWidget18460");

          console.log('🔧 Calling widget.create()...');
          widget.create({
            "widgetId": "V7426d21CAgJEEmrnv99karST5uXrt2h5zd7tj6SLzgdpc5gkJueBkYhx3yrT1tatzV2dyZVB1Jp9v5eHmEs524pz1NvspLs0e5489753751fbb4e9c67c76e72e2f39",
            "sipId": "548099_0",
            "domElement": "myZadarmaCallmeWidget18460"
          }, {
            "language": "en",
            "shape": "circle",
            "width": "0",
            "dtmf": false,
            "font": "'Trebuchet MS','Helvetica CY',sans-serif",
            "color_call": "rgb(255, 255, 255)",
            "color_bg_call": "rgb(59, 131, 246)",
            "color_border_call": "rgb(144, 192, 232)",
            "is_custom_hover": 1,
            "color_call_hover": "rgb(255, 255, 255)",
            "bg_call_hover": "rgb(100, 167, 26)",
            "border_call_hover": "rgb(178, 211, 141)",
            "color_connection": "rgb(255, 255, 255)",
            "color_bg_connection": "rgb(34, 197, 94)",
            "color_border_connection": "rgb(144, 233, 211)",
            "color_calling": "rgb(255, 255, 255)",
            "color_border_calling": "rgb(255, 218, 128)",
            "color_bg_calling": "rgb(255, 181, 0)",
            "color_ended": "rgb(255, 255, 255)",
            "color_bg_ended": "rgb(164, 164, 164)",
            "color_border_ended": "rgb(210, 210, 210)"
          });

          console.log('✅ Widget created successfully!');

          // Store widget globally for debugging
          (window as any).myZadarmaCallmeWidget18460 = widget;

          // Add debugging and pulsing animation for the widget element after creation
          setTimeout(() => {
            const updatedElement = document.getElementById('myZadarmaCallmeWidget18460');
            console.log('📊 Widget element after creation:');
            console.log('- Element:', updatedElement);
            console.log('- innerHTML:', updatedElement?.innerHTML);
            console.log('- children count:', updatedElement?.children.length);

            // Look for clickable elements and add pulse animation
            if (updatedElement) {
              const clickableElements = updatedElement.querySelectorAll('*');
              console.log('- Clickable elements found:', clickableElements.length);

              // Add pulse animation CSS
              const style = document.createElement('style');
              style.textContent = `
                @keyframes zadarma-pulse {
                  0% {
                    transform: scale(0.945);
                    box-shadow: 0 0 0 0 rgba(59, 131, 246, 0.5);
                  }
                  70% {
                    transform: scale(1.05);
                    box-shadow: 0 0 0 15px rgba(59, 131, 246, 0);
                  }
                  100% {
                    transform: scale(0.945);
                    box-shadow: 0 0 0 0 rgba(59, 131, 246, 0);
                  }
                }

                #myZadarmaCallmeWidget18460 > div {
                  animation: zadarma-pulse 1.5s infinite !important;
                }

                #myZadarmaCallmeWidget18460 > div:hover {
                  animation: none !important;
                }
              `;
              document.head.appendChild(style);

              clickableElements.forEach((el, index) => {
                console.log(`  ${index}: ${el.tagName} - ${el.className} - ${el.id}`);
              });
            }
          }, 2000);

        } catch (error) {
          console.error('❌ Error creating Zadarma widget:', error);
          console.error('Error details:', error);
        }

      } else if (retryCount < maxRetries) {
        console.log(`⏳ Retrying in 200ms... (missing: ${typeof (window as any).ZadarmaCallmeWidget === 'undefined' ? 'ZadarmaCallmeWidget' : 'DOM element'})`);
        setTimeout(checkAndInitialize, 200);
      } else {
        console.error('❌ Failed to initialize Zadarma widget after maximum retries');
        console.log('Available window properties:', Object.keys(window).filter(k => k.toLowerCase().includes('zadarma')));
      }
    };

    // Start checking after a delay to ensure scripts have time to load
    const timer = setTimeout(checkAndInitialize, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-start space-x-4">
      <div
        className="flex-shrink-0"
        style={{
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          id="myZadarmaCallmeWidget18460"
          style={{
            transform: 'scale(0.7)',
            transformOrigin: 'center'
          }}
        ></div>
      </div>
      <div>
        <h4
          className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1"
          {...(isUsingDirectus ? getEditableAttributes('contact_section', contactData.id, 'call_widget_title') : {})}
        >
          {contactData.call_widget_title}
        </h4>
        <p
          className="text-gray-600 dark:text-gray-300"
          {...(isUsingDirectus ? getEditableAttributes('contact_section', contactData.id, 'call_widget_description') : {})}
        >
          {contactData.call_widget_description}
        </p>
      </div>
    </div>
  );
};