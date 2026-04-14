"use client";
import Link from "next/link";
import ThemeChanger from "./DarkSwitch";
import Image from "next/image"
import { Disclosure } from "@headlessui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll effect
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
    "How It Works",
    "Features",
    "Pricing",
    "FAQ",
    "Contact",
  ];

  // Determine which logo to use
  const logoSrc = mounted && (resolvedTheme === 'dark' || theme === 'dark')
    ? "/img/tamamat-logo-dark.svg"
    : "/img/tamamat-logo-light.svg";

  // Determine text color based on theme
  const textColor = mounted && (resolvedTheme === 'dark' || theme === 'dark')
    ? "white"
    : "black";

  return (
    <div className={`w-full sticky top-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/80 dark:bg-trueGray-900/80 backdrop-blur-md shadow-lg'
        : 'bg-white dark:bg-trueGray-900'
    }`}>
      <nav className="container relative flex flex-wrap items-center justify-between p-8 mx-auto lg:justify-between xl:px-1">
        {/* Logo  */}
        <Link href="/">
          <span className="flex items-center space-x-3">
              <span>
                <Image
                  src={logoSrc}
                  width="73"
                  alt="TAMAMAT Logo"
                  height="46"
                  className="w-18 h-auto"
                />
              </span>
            <span
              className="text-2xl dark:text-gray-100"
              style={{
                fontFamily: "'Uncial Antiqua', system-ui",
                color: textColor,
                marginTop: "25px"
              }}
            >
              TAMAMAT
            </span>
          </span>
        </Link>

        {/* get started  */}
        <div className="gap-3 nav__item mr-2 lg:flex ml-auto lg:ml-0 lg:order-2">
            <ThemeChanger />
            <div className="hidden mr-3 lg:flex nav__item">
              <Link href="/" className="px-6 py-2 text-white bg-primary  hover:bg-primary-hover  rounded-md md:ml-5">
                Login
              </Link>
            </div>
        </div>
                
        <Disclosure>
          {({ open }) => (
            <>
                <Disclosure.Button
                  aria-label="Toggle Menu"
                  className="px-2 py-1 text-gray-500 rounded-md lg:hidden hover:text-blue-500 focus:text-blue-500 focus:bg-blue-100 focus:outline-none dark:text-gray-300 dark:focus:bg-trueGray-700">
                  <svg
                    className="w-6 h-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    {open && (
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                      />
                    )}
                    {!open && (
                      <path
                        fillRule="evenodd"
                        d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                      />
                    )}
                  </svg>
                </Disclosure.Button>

                <Disclosure.Panel className="flex flex-wrap w-full my-5 lg:hidden">
                  <>
                    {navigation.map((item, index) => {
                      const getHref = (menuItem: string) => {
                        switch(menuItem) {
                          case "Home": return "/";
                          case "How It Works": return "#how-it-works";
                          case "Features": return "#features";
                          case "Pricing": return "#pricing";
                          case "FAQ": return "#faq";
                          case "Contact": return "#contact";
                          default: return "/";
                        }
                      };
                      return (
                        <Link key={index} href={getHref(item)} className="w-full px-4 py-2 -ml-4 text-gray-500 rounded-md dark:text-gray-300 hover:text-blue-500 focus:text-blue-500 focus:bg-blue-100 dark:focus:bg-gray-800 focus:outline-none">
                            {item}
                        </Link>
                      );
                    })}
                    <Link href="/" className="w-full px-6 py-2 mt-3 text-center text-white bg-primary  rounded-md lg:ml-5">         
                        Login
                    </Link>
                  </>
                </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        
        {/* menu  */}
        <div className="hidden text-center lg:flex lg:items-center">
          <ul className="items-center justify-end flex-1 pt-6 list-none lg:pt-0 lg:flex">
            {navigation.map((menu, index) => {
              const getHref = (menuItem: string) => {
                switch(menuItem) {
                  case "Home": return "/";
                  case "How It Works": return "#how-it-works";
                  case "Features": return "#features";
                  case "Pricing": return "#pricing";
                  case "FAQ": return "#faq";
                  case "Contact": return "#contact";
                  default: return "/";
                }
              };
              return (
                <li className="mr-3 nav__item" key={index}>
                  <Link href={getHref(menu)} className="inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-md dark:text-gray-200 hover:text-blue-500 focus:text-blue-500 focus:bg-blue-100 focus:outline-none dark:focus:bg-gray-800">
                      {menu}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

      </nav>
    </div>
  );
}

