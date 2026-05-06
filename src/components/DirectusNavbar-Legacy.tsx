"use client";
import Link from "next/link";
import ThemeChanger from "./DarkSwitch";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { getHeaderConfig, getImageUrl } from "@/lib/directus";
import { HeaderConfig, NavigationItem } from "@/types";
import { getEditableAttributes } from "@/lib/visual-editor";
import { apply, remove } from "@directus/visual-editing";

export const DirectusNavbar = () => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<string>('light');
  const isUsingDirectus = !!headerConfig;

  const fallbackNavigation: NavigationItem[] = [
    { id: "fallback-1", label: "Home", href: "/", sort: 1, is_active: true },
    { id: "fallback-2", label: "How it Works", href: "#how-it-works", sort: 2, is_active: true },
    { id: "fallback-3", label: "Features", href: "#features", sort: 3, is_active: true },
    { id: "fallback-4", label: "Pricing", href: "#pricing", sort: 4, is_active: true },
    { id: "fallback-5", label: "FAQ", href: "#faq", sort: 5, is_active: true },
    { id: "fallback-6", label: "Contact", href: "#contact", sort: 6, is_active: true },
  ];

  useEffect(() => {
    setMounted(true);
    loadHeaderConfig();
  }, []);

  // Re-apply visual editor after headerConfig loads so it picks up
  // the data-directus attributes added to nav items after Directus data arrives
  useEffect(() => {
    if (!headerConfig) return;
    if (typeof window === 'undefined') return;
    if (window.parent === window) return; // Only in Visual Editor iframe

    const reapply = async () => {
      try {
        remove();
        await apply({
          directusUrl: process.env.NEXT_PUBLIC_DIRECTUS_URL as string,
          onSaved: () => window.location.reload(),
        });
      } catch (e) {
        // Silently ignore — visual editor may not always be active
      }
    };

    reapply();
  }, [headerConfig, currentTheme]); // re-applies on theme switch too

  useEffect(() => {
    if (mounted) {
      const detectTheme = () => {
        const htmlElement = document.documentElement;
        const hasThemeClass = htmlElement.classList.contains('dark');
        const bodyHasTheme = document.body.classList.contains('dark');
        const themeValue = resolvedTheme || theme;
        const isDark = hasThemeClass || bodyHasTheme || themeValue === 'dark';
        setCurrentTheme(isDark ? 'dark' : 'light');
        if (isDark && !hasThemeClass) {
          htmlElement.classList.add('dark');
        } else if (!isDark && hasThemeClass) {
          htmlElement.classList.remove('dark');
        }
      };
      detectTheme();
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
      const sections = [
        { name: 'Contact', element: document.getElementById('contact') },
        { name: 'FAQ', element: document.getElementById('faq') },
        { name: 'Pricing', element: document.getElementById('pricing') },
        { name: 'Features', element: document.getElementById('features') },
        { name: 'How it Works', element: document.getElementById('how-it-works') }
      ];
      const offset = 200;
      let currentActive = 'Home';
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

  // Keep full navigation item objects (preserves id for visual editor)
  const navigationItems: NavigationItem[] = (headerConfig && headerConfig.navigation_items)
    ? headerConfig.navigation_items
        .filter(item => item.is_active)
        .sort((a, b) => a.sort - b.sort)
    : fallbackNavigation;

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
      if (logoFileId) return getImageUrl(logoFileId);
    }
    return currentTheme === 'dark'
      ? "/img/TAMAMAT-logo-200x122-Dark-Theme.svg"
      : "/img/TAMAMAT-logo-200x122-Light-Theme.svg";
  };

  const getLogoEditableAttributes = () => {
    if (!headerConfig?.logo?.id) return {};
    const field = currentTheme === 'dark' ? 'dark_theme_logo' : 'light_theme_logo';
    return getEditableAttributes('header_logos', headerConfig.logo.id, field);
  };

  const companyTitle = (headerConfig && headerConfig.company_title) ? headerConfig.company_title : "TAMAMAT";
  const loginButton = (headerConfig && headerConfig.login_button) ? headerConfig.login_button : {
    text: "Login",
    href: "/",
    enabled: true
  };
  const themeToggleEnabled = !(headerConfig && headerConfig.theme_toggle_enabled === false);

  const getHref = (menuItem: string) => {
    if (headerConfig && headerConfig.navigation_items) {
      const navItem = headerConfig.navigation_items.find(item => item.label === menuItem);
      if (navItem) return navItem.href;
    }
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
    if (item !== "Home") {
      const href = getHref(item);
      if (href.indexOf('#') === 0) {
        const element = document.querySelector(href);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = href;
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const logoWidth = (headerConfig && headerConfig.logo && headerConfig.logo.width) ? headerConfig.logo.width : 50;
  const logoHeight = (headerConfig && headerConfig.logo && headerConfig.logo.height) ? headerConfig.logo.height : 31;
  const logoAlt = (headerConfig && headerConfig.logo && headerConfig.logo.alt_text) ? headerConfig.logo.alt_text : "TAMAMAT Logo";

  return (
    <>

      {/* Floating Navigation Container */}
      <div className={`navbar-container fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100vw-32px)] max-w-7xl transition-all duration-400 ${loading ? 'loading' : 'loaded'}`}>
        <nav className="navbar bg-white/80 dark:bg-black/10 backdrop-blur-[20px] border border-gray-200/50 dark:border-white/10 rounded-[50px] px-6 py-3 flex items-center justify-between shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-400 relative overflow-hidden min-w-0">
          <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-800 group-hover:left-full"></div>

          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 text-gray-800 dark:text-white font-bold text-xl z-10 relative">
            <Image
              src={getLogoSource()}
              width={logoWidth}
              height={logoHeight}
              alt={logoAlt}
              className="h-8 w-auto"
              {...getLogoEditableAttributes()}
            />
            <span
              className="company-title mt-3"
              style={{
                fontFamily: "'Uncial Antiqua', serif",
                color: currentTheme === 'dark' ? '#ffffff' : '#1f2937',
                fontWeight: 'bold'
              }}
              {...(headerConfig ? getEditableAttributes('header_config', headerConfig.id, 'company_title') : {})}
            >
              {companyTitle}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-1 list-none z-10 relative">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleLinkClick(item.label)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-[25px] transition-all duration-300 relative ${
                    activeLink === item.label
                      ? 'bg-white/20 dark:bg-white/5 text-gray-800 dark:text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_12px_rgba(255,255,255,0.02)]'
                      : 'text-gray-700 dark:text-white/90 hover:text-gray-900 dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/10 hover:transform hover:translate-y-[-2px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]'
                  }`}
                  {...(isUsingDirectus ? getEditableAttributes('navigation_items', item.id, 'label') : {})}
                >
                  <span>{item.label}</span>
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
              <li className="ml-6">
                <Link
                  href={loginButton.href}
                  className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white px-5 py-2.5 rounded-[25px] font-semibold text-sm shadow-[0_8px_20px_rgba(59,130,246,0.3)] transition-all duration-300 hover:transform hover:translate-y-[-1px] hover:shadow-[0_10px_20px_rgba(59,130,246,0.4)] whitespace-nowrap"
                  {...(headerConfig ? getEditableAttributes('header_config', headerConfig.id, 'login_button') : {})}
                >
                  {loginButton.text}
                </Link>
              </li>
            )}
          </ul>

          {/* Mobile Controls Group */}
          <div className="lg:hidden flex items-center gap-4 flex-shrink-0">
            {themeToggleEnabled && (
              <div className="text-gray-700 dark:text-white">
                <ThemeChanger />
              </div>
            )}
            <button
              onClick={toggleMobileMenu}
              className={`flex flex-col gap-1 w-6 h-4 cursor-pointer z-50 transition-all duration-300 ${mobileMenuOpen ? 'active' : ''}`}
            >
              <span className={`w-6 h-0.5 bg-gray-800 dark:bg-white rounded transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-gray-800 dark:bg-white rounded transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 translate-x-[-20px]' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-gray-800 dark:bg-white rounded transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
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
                {...getLogoEditableAttributes()}
              />
            </div>
            <span
              style={{ fontFamily: "'Uncial Antiqua', serif", color: '#ffffff', fontWeight: 'bold' }}
              {...(headerConfig ? getEditableAttributes('header_config', headerConfig.id, 'company_title') : {})}
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
          {navigationItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleLinkClick(item.label)}
                className={`flex items-center gap-4 p-5 text-lg font-medium rounded-2xl transition-all duration-300 border w-full text-left ${
                  activeLink === item.label
                    ? 'bg-black/25 text-white border-white/20 shadow-lg'
                    : 'text-white/90 hover:text-white hover:bg-white/10 hover:transform hover:translate-x-2 border-white/10 bg-white/5'
                }`}
                {...(isUsingDirectus ? getEditableAttributes('navigation_items', item.id, 'label') : {})}
              >
                <span>{item.label}</span>
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
              {...(headerConfig ? getEditableAttributes('header_config', headerConfig.id, 'login_button') : {})}
            >
              {loginButton.text}
            </Link>
          </div>
        )}
      </div>

      <style jsx global>{`
        html.dark, html.dark body { background-color: #0f172a !important; color: #ffffff !important; }
        html:not(.dark), html:not(.dark) body { background-color: #ffffff !important; color: #1f2937 !important; }
        html.dark body { --tw-bg-opacity: 1; }
        html.dark .navbar { background: rgba(0, 0, 0, 0.1) !important; backdrop-filter: blur(20px) !important; -webkit-backdrop-filter: blur(20px) !important; border-color: rgba(255, 255, 255, 0.1) !important; }
        html:not(.dark) .navbar { background: rgba(255, 255, 255, 0.8) !important; backdrop-filter: blur(20px) !important; -webkit-backdrop-filter: blur(20px) !important; border-color: rgba(229, 231, 235, 0.5) !important; }
        html.dark .company-title { color: #ffffff !important; }
        html:not(.dark) .company-title { color: #1f2937 !important; }
        html h1, html h2, html h3,
        html.dark h1, html.dark h2, html.dark h3,
        html:not(.dark) h1, html:not(.dark) h2, html:not(.dark) h3,
        body h1, body h2, body h3,
        html body h1, html body h2, html body h3,
        html.dark body h1, html.dark body h2, html.dark body h3 { color: #3B82F6 !important; }
        html h1.text-gray-800, html h2.text-gray-800, html h3.text-gray-800,
        html h1.text-gray-700, html h2.text-gray-700, html h3.text-gray-700,
        html.dark h1.text-gray-800, html.dark h2.text-gray-800, html.dark h3.text-gray-800,
        html.dark h1.text-white, html.dark h2.text-white, html.dark h3.text-white { color: #3B82F6 !important; }
        html.dark .text-gray-800:not(h1):not(h2):not(h3) { color: rgba(255, 255, 255, 1) !important; }
        html.dark .text-gray-700:not(h1):not(h2):not(h3) { color: rgba(255, 255, 255, 0.9) !important; }
        html:not(.dark) .text-gray-800:not(h1):not(h2):not(h3) { color: rgba(31, 41, 55, 1) !important; }
        html:not(.dark) .text-gray-700:not(h1):not(h2):not(h3) { color: rgba(55, 65, 81, 1) !important; }
        html.dark main, html.dark section, html.dark div.bg-white { background-color: #0f172a !important; }
        html.dark .bg-gray-100.dark\\:bg-gray-800\\/20 { background-color: rgba(55, 65, 81, 0.2) !important; }
        html.dark .bg-white:not([class*="/80"]):not([class*="backdrop-blur"]) { background-color: #171717 !important; }
        html.dark .bg-gray-50[class*="DisclosureButton"] { background-color: #374151 !important; }
        html.dark .hover\\:bg-gray-100:hover { background-color: #4b5563 !important; }
        html.dark .bg-gray-100:not([class*="backdrop-blur"]):not([class*="/80"]) { background-color: #374151 !important; }
        html.dark input, html.dark textarea, html.dark select { background-color: #374151 !important; border-color: #4b5563 !important; color: #ffffff !important; }
        html.dark .shadow-lg { box-shadow: 0 10px 40px rgba(255,255,255,0.1) !important; }
        html.dark button { color: rgba(255, 255, 255, 0.9) !important; }
        html.dark button:hover { color: rgba(255, 255, 255, 1) !important; }
        .navbar:hover::before { left: 100% !important; }
        .navbar::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); transition: left 0.8s ease; }
        .navbar:hover::before { left: 100%; }
        .navbar:hover { transform: translateY(-2px); box-shadow: 0 25px 50px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3); }
        /* Ensure consistent centering across all screen sizes */
        .navbar-container {
          left: 50% !important;
          transform: translateX(-50%) !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
        }

        /* Handle loading states to prevent content shift */
        .navbar-container.loading {
          transition: none !important;
        }

        .navbar-container.loaded {
          transition: all 0.4s ease !important;
        }

        /* Fix initial load centering issue */
        .navbar {
          margin: 0 auto;
          position: relative;
          min-width: 0;
          max-width: 100%;
        }

        /* Prevent overflow during content loading */
        @media (max-width: 768px) {
          .navbar {
            min-width: 0 !important;
            width: 100% !important;
          }

          /* Ensure logo doesn't cause overflow */
          .navbar img {
            max-width: 120px !important;
            height: auto !important;
          }

          /* Mobile controls should never overflow */
          .lg\\:hidden {
            flex-shrink: 0 !important;
            min-width: fit-content !important;
          }
        }

        @media (max-width: 1024px) {
          .fixed.top-8 {
            top: 20px;
            width: calc(100vw - 32px) !important;
          }
        }
        @media (max-width: 768px) {
          .fixed.top-8 {
            top: 15px;
            width: calc(100vw - 24px) !important;
          }
          .navbar {
            padding-left: 0.75rem !important;
            padding-right: 0.75rem !important;
          }
        }
        @media (max-width: 480px) {
          .fixed.top-8 {
            width: calc(100vw - 16px) !important;
          }
          .navbar {
            padding-left: 0.75rem !important;
            padding-right: 0.75rem !important;
          }
        }
      `}</style>
    </>
  );
};
