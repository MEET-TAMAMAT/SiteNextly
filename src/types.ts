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
