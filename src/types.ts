export interface PageProps {
  params: {
    slug: string;
  };
  searchParams: {};
}

// Directus Header Configuration
export interface HeaderLogo {
  id: string;
  light_theme_logo: string | { id: string; [key: string]: any };
  dark_theme_logo: string | { id: string; [key: string]: any };
  alt_text: string;
  width: number;
  height: number;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  sort: number;
  is_active: boolean;
}

export interface HeaderConfig {
  id: string;
  company_title: string;
  logo: HeaderLogo;
  navigation_items: NavigationItem[];
  theme_toggle_enabled: boolean;
  login_button: {
    text: string;
    href: string;
    enabled: boolean;
  };
  status: string;
}

// Directus Homepage Configuration
export interface HomeContent {
  id: string;
  status: string;
  home_title: string;
  home_description: string;
  home_button: string;
  home_image: string | { id: string; [key: string]: any } | null;
  created_on: string;
  updated_on: string;
}

// Directus How it Works Configuration
export interface HowItWorksContent {
  id: string;
  main_heading: string;
  manual_selection_title: string;
  manual_selection_description: string;
  auto_selection_title: string;
  auto_selection_description: string;
  video_button_text: string;
  main_illustration: string | { id: string; [key: string]: any } | null;
}
