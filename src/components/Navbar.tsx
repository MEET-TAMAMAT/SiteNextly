"use client";
import Link from "next/link";
import ThemeChanger from "./DarkSwitch";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    "Home",
    "How it Works",
    "Features",
    "Pricing",
    "FAQ",
    "Contact",
  ];

  const logoSrc = mounted && (resolvedTheme === 'dark' || theme === 'dark')
    ? "/img/TAMAMAT-logo-200x122-Dark-Theme.svg"
    : "/img/TAMAMAT-logo-200x122-Light-Theme.svg";

  const getHref = (menuItem: string) => {
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
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Floating Navigation Container */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-60px)] max-w-5xl transition-all duration-400">
        <nav className="navbar bg-white/80 dark:bg-black/10 backdrop-blur-[20px] border border-gray-200/50 dark:border-white/10 rounded-[50px] px-6 py-3 flex items-center justify-between shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-400 relative overflow-hidden">
          {/* Shimmer Effect */}
          <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-800 group-hover:left-full"></div>

          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 text-gray-800 dark:text-white font-bold text-xl z-10 relative">
            <Image
              src={logoSrc}
              width="50"
              height="31"
              alt="TAMAMAT Logo"
              className="h-8 w-auto"
            />
            <span
              className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-100 bg-clip-text text-transparent"
              style={{ fontFamily: "var(--font-uncial-antiqua)" }}
            >
              TAMAMAT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-1 list-none z-10 relative">
            {navigation.map((item) => (
              <li key={item}>
                <Link
                  href={getHref(item)}
                  onClick={() => handleLinkClick(item)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-[25px] transition-all duration-300 relative overflow-hidden ${
                    activeLink === item
                      ? 'bg-white/20 dark:bg-white/5 text-gray-800 dark:text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_12px_rgba(255,255,255,0.02)]'
                      : 'text-gray-700 dark:text-white/90 hover:text-gray-900 dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/10 hover:transform hover:translate-y-[-2px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]'
                  }`}
                >
                  <span>{item}</span>
                </Link>
              </li>
            ))}
            <li className="ml-2">
              <Link
                href="/"
                className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white px-5 py-2.5 rounded-[25px] font-semibold text-sm shadow-[0_8px_20px_rgba(59,130,246,0.3)] transition-all duration-300 hover:transform hover:translate-y-[-1px] hover:shadow-[0_10px_20px_rgba(59,130,246,0.4)] whitespace-nowrap"
              >
                Login
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={`lg:hidden flex flex-col gap-1 w-6 h-4 cursor-pointer z-50 transition-all duration-300 ${
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
                src={logoSrc}
                width="45"
                height="28"
                alt="TAMAMAT Logo"
                className="h-7 w-auto"
              />
            </div>
            <span style={{ fontFamily: "var(--font-uncial-antiqua)" }}>TAMAMAT</span>
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
              <Link
                href={getHref(item)}
                onClick={() => handleLinkClick(item)}
                className={`flex items-center gap-4 p-5 text-lg font-medium rounded-2xl transition-all duration-300 border ${
                  activeLink === item
                    ? 'bg-black/25 text-white border-white/20 shadow-lg'
                    : 'text-white/90 hover:text-white hover:bg-white/10 hover:transform hover:translate-x-2 border-white/10 bg-white/5'
                }`}
              >
                <span>{item}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Theme Toggle */}
        <div className="px-8 py-1">
          <div className="flex items-center justify-center gap-3 px-5 py-2 cursor-pointer hover:bg-white/5 rounded-xl transition-all duration-300" onClick={(e) => {
            e.preventDefault();
            const themeButton = e.currentTarget.querySelector('button');
            if (themeButton) {
              themeButton.click();
            }
            setMobileMenuOpen(false);
          }}>
            <span className="text-white/90 font-medium text-lg">Theme</span>
            <div className="text-white [&>button]:text-white [&_svg]:fill-white [&_*]:text-white">
              <ThemeChanger />
            </div>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="p-8">
          <Link
            href="/"
            className="block w-full bg-white text-[#3B82F6] text-center py-4 rounded-2xl font-semibold text-lg shadow-[0_10px_30px_rgba(255,255,255,0.3)] transition-all duration-300 hover:transform hover:translate-y-[-2px] hover:shadow-[0_15px_40px_rgba(255,255,255,0.4)]"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Theme Changer - Desktop only */}
      <div className="hidden lg:block fixed top-4 right-4 z-40">
        <ThemeChanger />
      </div>

      {/* Add custom styles */}
      <style jsx global>{`
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

