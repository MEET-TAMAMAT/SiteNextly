"use client";
import Link from "next/link";
import ThemeChanger from "./DarkSwitch";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { getHeaderConfig, getImageUrl } from "@/lib/directus";
import { HeaderConfig } from "@/types";

export const DirectusNavbar = () => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<string>('light');

  // Fallback navigation for when Directus is unavailable
  const fallbackNavigation = [
    "Home",
    "How it Works",
    "Features",
    "Pricing",
    "FAQ",
    "Contact",
  ];

  useEffect(() => {
    setMounted(true);
    loadHeaderConfig();
  }, []);

  // Enhanced theme tracking for older browsers
  useEffect(() => {
    if (mounted) {
      const detectTheme = () => {
        // Check multiple sources for theme
        const htmlElement = document.documentElement;
        const hasThemeClass = htmlElement.classList.contains('dark');
        const bodyHasTheme = document.body.classList.contains('dark');
        const themeValue = resolvedTheme || theme;

        // Force theme application if not properly applied
        const isDark = hasThemeClass || bodyHasTheme || themeValue === 'dark';
        setCurrentTheme(isDark ? 'dark' : 'light');

        // Ensure theme class is applied to html element
        if (isDark && !hasThemeClass) {
          htmlElement.classList.add('dark');
        } else if (!isDark && hasThemeClass) {
          htmlElement.classList.remove('dark');
        }
      };

      detectTheme();

      // Re-check theme every 100ms for the first 2 seconds (older browser compatibility)
      const themeCheckInterval = setInterval(detectTheme, 100);
      setTimeout(() => clearInterval(themeCheckInterval), 2000);

      return () => clearInterval(themeCheckInterval);
    }
  }, [mounted, theme, resolvedTheme]);

  const loadHeaderConfig = async () => {
    try {
      const config = await getHeaderConfig();
      setHeaderConfig(config);
    } catch (error) {
      console.error("Failed to load header config:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);

      // Update active link based on scroll position
      const sections = [
        { name: 'Contact', element: document.getElementById('contact') },
        { name: 'FAQ', element: document.getElementById('faq') },
        { name: 'Pricing', element: document.getElementById('pricing') },
        { name: 'Features', element: document.getElementById('features') },
        { name: 'How it Works', element: document.getElementById('how-it-works') }
      ];

      const offset = 200; // Account for navbar height
      let currentActive = 'Home';

      // Check sections from bottom to top
      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= offset) {
            currentActive = section.name;
            break;
          }
        }
      }

      setActiveLink(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get navigation items from Directus or fallback (using legacy syntax)
  const navigation = (headerConfig && headerConfig.navigation_items)
    ? headerConfig.navigation_items
        .filter(item => item.is_active)
        .sort((a, b) => a.sort - b.sort)
        .map(item => item.label)
    : fallbackNavigation;

  // Get logo source (using legacy syntax and reliable theme detection)
  const getLogoSource = () => {
    if (!mounted) return "/img/TAMAMAT-logo-200x122-Light-Theme.svg";

    if (headerConfig && headerConfig.logo) {
      const isDark = currentTheme === 'dark';
      const logoFile = isDark ? headerConfig.logo.dark_theme_logo : headerConfig.logo.light_theme_logo;
      let logoFileId;

      if (typeof logoFile === 'string') {
        logoFileId = logoFile;
      } else if (logoFile && logoFile.id) {
        logoFileId = logoFile.id;
      }

      if (logoFileId) {
        return getImageUrl(logoFileId);
      }
    }

    // Fallback using currentTheme
    return currentTheme === 'dark'
      ? "/img/TAMAMAT-logo-200x122-Dark-Theme.svg"
      : "/img/TAMAMAT-logo-200x122-Light-Theme.svg";
  };

  // Get company title (using legacy syntax)
  const companyTitle = (headerConfig && headerConfig.company_title) ? headerConfig.company_title : "TAMAMAT";

  // Get login button config (using legacy syntax)
  const loginButton = (headerConfig && headerConfig.login_button) ? headerConfig.login_button : {
    text: "Login",
    href: "/",
    enabled: true
  };

  // Check if theme toggle is enabled (using legacy syntax)
  const themeToggleEnabled = !(headerConfig && headerConfig.theme_toggle_enabled === false);

  const getHref = (menuItem: string) => {
    if (headerConfig && headerConfig.navigation_items) {
      const navItem = headerConfig.navigation_items.find(item => item.label === menuItem);
      if (navItem) return navItem.href;
    }

    // Fallback href logic
    switch(menuItem) {
      case "Home": return "/";
      case "How it Works": return "#how-it-works";
      case "Features": return "#features";
      case "Pricing": return "#pricing";
      case "FAQ": return "#faq";
      case "Contact": return "#contact";
      default: return "/";
    }
  };

  const handleLinkClick = (item: string) => {
    setActiveLink(item);
    setMobileMenuOpen(false);

    // Navigate to the section
    if (item !== "Home") {
      const href = getHref(item);
      if (href.indexOf('#') === 0) {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.location.href = href;
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  if (loading) {
    return (
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-60px)] container xl:px-8">
        <div className="navbar bg-white/80 dark:bg-black/10 backdrop-blur-[20px] border border-gray-200/50 dark:border-white/10 rounded-[50px] px-6 py-3 h-[60px] animate-pulse">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="w-24 h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="hidden lg:flex items-center gap-4">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="w-16 h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get logo dimensions safely
  const logoWidth = (headerConfig && headerConfig.logo && headerConfig.logo.width) ? headerConfig.logo.width : 50;
  const logoHeight = (headerConfig && headerConfig.logo && headerConfig.logo.height) ? headerConfig.logo.height : 31;
  const logoAlt = (headerConfig && headerConfig.logo && headerConfig.logo.alt_text) ? headerConfig.logo.alt_text : "TAMAMAT Logo";

  return (
    <>
      {/* Floating Navigation Container */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-60px)] container xl:px-8 transition-all duration-400">
        <nav className="navbar bg-white/80 dark:bg-black/10 backdrop-blur-[20px] border border-gray-200/50 dark:border-white/10 rounded-[50px] px-6 py-3 flex items-center justify-between shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-400 relative overflow-hidden">
          {/* Shimmer Effect */}
          <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-800 group-hover:left-full"></div>

          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 text-gray-800 dark:text-white font-bold text-xl z-10 relative">
            <Image
              src={getLogoSource()}
              width={logoWidth}
              height={logoHeight}
              alt={logoAlt}
              className="h-8 w-auto"
            />
            <span
              className="company-title mt-3"
              style={{
                fontFamily: "'Uncial Antiqua', serif",
                color: currentTheme === 'dark' ? '#ffffff' : '#1f2937',
                fontWeight: 'bold'
              }}
            >
              {companyTitle}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-1 list-none z-10 relative">
            {navigation.map((item) => (
              <li key={item}>
                <button
                  onClick={() => handleLinkClick(item)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-[25px] transition-all duration-300 relative overflow-hidden ${
                    activeLink === item
                      ? 'bg-white/20 dark:bg-white/5 text-gray-800 dark:text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_12px_rgba(255,255,255,0.02)]'
                      : 'text-gray-700 dark:text-white/90 hover:text-gray-900 dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/10 hover:transform hover:translate-y-[-2px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]'
                  }`}
                >
                  <span>{item}</span>
                </button>
              </li>
            ))}
            {themeToggleEnabled && (
              <li className="ml-2">
                <div className="text-gray-700 dark:text-white">
                  <ThemeChanger />
                </div>
              </li>
            )}
            {loginButton.enabled && (
              <li className="ml-2">
                <Link
                  href={loginButton.href}
                  className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white px-5 py-2.5 rounded-[25px] font-semibold text-sm shadow-[0_8px_20px_rgba(59,130,246,0.3)] transition-all duration-300 hover:transform hover:translate-y-[-1px] hover:shadow-[0_10px_20px_rgba(59,130,246,0.4)] whitespace-nowrap"
                >
                  {loginButton.text}
                </Link>
              </li>
            )}
          </ul>

          {/* Mobile Controls Group */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Theme Toggle */}
            {themeToggleEnabled && (
              <div className="text-gray-700 dark:text-white">
                <ThemeChanger />
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className={`flex flex-col gap-1 w-6 h-4 cursor-pointer z-50 transition-all duration-300 ${
                mobileMenuOpen ? 'active' : ''
              }`}
            >
            <span className={`w-6 h-0.5 bg-gray-800 dark:bg-white rounded transition-all duration-300 ${
              mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
            }`}></span>
            <span className={`w-6 h-0.5 bg-gray-800 dark:bg-white rounded transition-all duration-300 ${
              mobileMenuOpen ? 'opacity-0 translate-x-[-20px]' : ''
            }`}></span>
            <span className={`w-6 h-0.5 bg-gray-800 dark:bg-white rounded transition-all duration-300 ${
              mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
            }`}></span>
          </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1500] opacity-100 transition-opacity duration-300 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 w-full h-full bg-gradient-to-br from-[#3B82F6] via-[#1D4ED8] to-[#1E40AF] z-[1600] lg:hidden transition-transform duration-400 ${
        mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
      }`}>
        {/* Mobile Menu Header */}
        <div className="flex justify-between items-center p-8 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3 text-white font-bold text-xl">
            <div className="bg-gray-100 dark:bg-gray-800 backdrop-blur-sm rounded-xl p-2 shadow-lg">
              <Image
                src={getLogoSource()}
                width={(headerConfig && headerConfig.logo && headerConfig.logo.width) ? headerConfig.logo.width : 45}
                height={(headerConfig && headerConfig.logo && headerConfig.logo.height) ? headerConfig.logo.height : 28}
                alt={logoAlt}
                className="h-7 w-auto"
              />
            </div>
            <span
              style={{
                fontFamily: "'Uncial Antiqua', serif",
                color: '#ffffff',
                fontWeight: 'bold'
              }}
            >
              {companyTitle}
            </span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white text-2xl hover:bg-white/20 transition-colors duration-300"
          >
            ×
          </button>
        </div>

        {/* Mobile Menu Navigation */}
        <ul className="p-8 space-y-2">
          {navigation.map((item) => (
            <li key={item}>
              <button
                onClick={() => handleLinkClick(item)}
                className={`flex items-center gap-4 p-5 text-lg font-medium rounded-2xl transition-all duration-300 border w-full text-left ${
                  activeLink === item
                    ? 'bg-black/25 text-white border-white/20 shadow-lg'
                    : 'text-white/90 hover:text-white hover:bg-white/10 hover:transform hover:translate-x-2 border-white/10 bg-white/5'
                }`}
              >
                <span>{item}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile CTA */}
        {loginButton.enabled && (
          <div className="p-8">
            <Link
              href={loginButton.href}
              className="block w-full bg-white text-[#3B82F6] text-center py-4 rounded-2xl font-semibold text-lg shadow-[0_10px_30px_rgba(255,255,255,0.3)] transition-all duration-300 hover:transform hover:translate-y-[-2px] hover:shadow-[0_15px_40px_rgba(255,255,255,0.4)]"
            >
              {loginButton.text}
            </Link>
          </div>
        )}
      </div>

      {/* Add custom styles with better browser compatibility */}
      <style jsx global>{`
        /* Force dark theme background for older browsers */
        html.dark,
        html.dark body {
          background-color: #0f172a !important;
          color: #ffffff !important;
        }

        /* Light theme background */
        html:not(.dark),
        html:not(.dark) body {
          background-color: #ffffff !important;
          color: #1f2937 !important;
        }

        /* Enhanced theme support for older browsers */
        html.dark body,
        html.dark .navbar {
          --tw-bg-opacity: 1;
        }

        /* Force theme colors for navbar */
        html.dark .navbar {
          background-color: rgba(0, 0, 0, 0.1) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }

        html:not(.dark) .navbar {
          background-color: rgba(255, 255, 255, 0.8) !important;
          border-color: rgba(229, 231, 235, 0.5) !important;
        }

        /* Company title styling */
        html.dark .company-title {
          color: #ffffff !important;
        }

        html:not(.dark) .company-title {
          color: #1f2937 !important;
        }

        /* Theme-specific text colors */
        html.dark .text-gray-800 {
          color: rgba(255, 255, 255, 1) !important;
        }

        html.dark .text-gray-700 {
          color: rgba(255, 255, 255, 0.9) !important;
        }

        html:not(.dark) .text-gray-800 {
          color: rgba(31, 41, 55, 1) !important;
        }

        html:not(.dark) .text-gray-700 {
          color: rgba(55, 65, 81, 1) !important;
        }

        /* Force dark background for all major containers */
        html.dark main,
        html.dark section,
        html.dark div.bg-white {
          background-color: #0f172a !important;
        }

        /* Fix specific section backgrounds in dark mode */

        /* 1. How It Works section - Manual/Auto Selection backgrounds */
        html.dark .bg-gray-100 {
          background-color: rgba(55, 65, 81, 0.2) !important;
        }

        /* 2. Pricing section - Card backgrounds */
        html.dark .bg-white {
          background-color: #171717 !important;
        }

        /* 3. FAQ section - Question backgrounds */
        html.dark .bg-gray-50 {
          background-color: #374151 !important;
        }

        html.dark .hover\\:bg-gray-100:hover {
          background-color: #4b5563 !important;
        }

        /* 4. Contact section - Contact blocks */
        html.dark .bg-gray-100 {
          background-color: #374151 !important;
        }

        /* Contact form inputs */
        html.dark input,
        html.dark textarea,
        html.dark select {
          background-color: #374151 !important;
          border-color: #4b5563 !important;
          color: #ffffff !important;
        }

        /* Override any remaining light backgrounds in dark mode */
        html.dark [class*="bg-gray-50"],
        html.dark [class*="bg-gray-100"],
        html.dark [class*="bg-white"] {
          background-color: #374151 !important;
        }

        /* Pricing card specific overrides */
        html.dark .shadow-lg {
          box-shadow: 0 10px 40px rgba(255,255,255,0.1) !important;
        }

        /* Button and interactive element colors */
        html.dark button {
          color: rgba(255, 255, 255, 0.9) !important;
        }

        html.dark button:hover {
          color: rgba(255, 255, 255, 1) !important;
        }

        /* Navbar animations */
        .navbar:hover::before {
          left: 100% !important;
        }
        .navbar::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.8s ease;
        }
        .navbar:hover::before {
          left: 100%;
        }
        .navbar:hover {
          transform: translateY(-2px);
          box-shadow: 0 25px 50px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3);
        }

        @media (max-width: 1024px) {
          .fixed.top-8 {
            top: 20px;
            width: calc(100% - 30px);
          }
        }
        @media (max-width: 768px) {
          .fixed.top-8 {
            top: 15px;
            width: calc(100% - 20px);
          }
        }
      `}</style>
    </>
  );
};