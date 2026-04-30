"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface NotificationModalProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'validation';
  title?: string;
  message: string;
  onClose: () => void;
  autoCloseMs?: number; // Auto-close after this many milliseconds (0 = no auto-close)
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  type,
  title,
  message,
  onClose,
  autoCloseMs = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300); // Match animation duration
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);

      // Auto-close timer
      if (autoCloseMs > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseMs);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, autoCloseMs, handleClose]);

  useEffect(() => {
    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleClose]);

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircleIcon,
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          textColor: 'text-green-600 dark:text-green-400',
          borderColor: 'border-green-200 dark:border-green-700',
          iconColor: 'text-green-600 dark:text-green-400'
        };
      case 'error':
        return {
          icon: ExclamationCircleIcon,
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          textColor: 'text-red-600 dark:text-red-400',
          borderColor: 'border-red-200 dark:border-red-700',
          iconColor: 'text-red-600 dark:text-red-400'
        };
      case 'validation':
        return {
          icon: ExclamationCircleIcon,
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          textColor: 'text-red-600 dark:text-red-400',
          borderColor: 'border-red-200 dark:border-red-700',
          iconColor: 'text-red-600 dark:text-red-400'
        };
      default:
        return {
          icon: ExclamationCircleIcon,
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          textColor: 'text-gray-600 dark:text-gray-400',
          borderColor: 'border-gray-200 dark:border-gray-700',
          iconColor: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  if (!isVisible) return null;

  const typeConfig = getTypeConfig();
  const IconComponent = typeConfig.icon;

  return createPortal(
    <div className={`
      fixed inset-0 z-50 flex items-center justify-center px-4
      transition-all duration-300 ease-out
      ${isAnimating
        ? 'opacity-100'
        : 'opacity-0'
      }
    `}>
      {/* Backdrop */}
      <div
        className={`
          absolute inset-0
          bg-black/50 backdrop-blur-sm
          transition-all duration-300 ease-out
          ${isAnimating
            ? 'opacity-100'
            : 'opacity-0'
          }
        `}
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className={`
        relative w-full max-w-md mx-auto
        bg-white dark:bg-gray-800
        rounded-2xl shadow-2xl
        border ${typeConfig.borderColor}
        transform transition-all duration-300 ease-out
        ${isAnimating
          ? 'scale-100 translate-y-0'
          : 'scale-95 translate-y-4'
        }
      `}>
        {/* Header */}
        <div className={`
          px-6 py-4 border-b border-gray-200 dark:border-gray-700
          flex items-center justify-between
        `}>
          <div className="flex items-center space-x-3">
            <IconComponent className={`w-6 h-6 ${typeConfig.iconColor}`} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title || (type === 'success' ? 'Success!' : 'Attention Required')}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close notification"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className={`px-6 py-4 ${typeConfig.bgColor}`}>
          <p className={`${typeConfig.textColor} leading-relaxed`}>
            {message}
          </p>
        </div>

        {/* Footer with progress bar for auto-close */}
        {autoCloseMs > 0 && type === 'success' && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Auto-closing in {Math.ceil(autoCloseMs / 1000)} seconds...</span>
              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all ease-linear"
                  style={{
                    width: '100%',
                    animation: `shrink ${autoCloseMs}ms linear forwards`
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Close button for error/validation messages */}
        {(type === 'error' || type === 'validation') && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
            <button
              onClick={handleClose}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>,
    document.body
  );
};