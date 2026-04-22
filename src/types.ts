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

// Directus Features Section Configuration
export interface FeaturesContent {
  id: string;
  main_title: string;
  main_image: string | { id: string; [key: string]: any } | null;
  status: string;
  feature_1_icon: string;
  feature_1_title: string;
  feature_1_description: string;
  feature_2_icon: string;
  feature_2_title: string;
  feature_2_description: string;
  feature_3_icon: string;
  feature_3_title: string;
  feature_3_description: string;
  feature_4_icon: string;
  feature_4_title: string;
  feature_4_description: string;
  feature_5_icon: string;
  feature_5_title: string;
  feature_5_description: string;
  feature_6_icon: string;
  feature_6_title: string;
  feature_6_description: string;
}

// Directus Pricing Section Configuration
export interface PricingContent {
  id: string;
  main_title: string;
  status: string;
  plan_1_name: string;
  plan_1_color: string;
  plan_1_price: string;
  plan_1_price_description: string;
  plan_1_icon: string;
  plan_1_feature_1: string;
  plan_1_feature_2: string;
  plan_1_feature_3: string;
  plan_1_feature_4: string;
  plan_1_feature_5: string;
  plan_1_button_text: string;
  plan_1_button_link: string;
  plan_2_name: string;
  plan_2_color: string;
  plan_2_price: string;
  plan_2_price_description: string;
  plan_2_icon: string;
  plan_2_feature_1: string;
  plan_2_feature_2: string;
  plan_2_feature_3: string;
  plan_2_feature_4: string;
  plan_2_feature_5: string;
  plan_2_button_text: string;
  plan_2_button_link: string;
  plan_3_name: string;
  plan_3_color: string;
  plan_3_price: string;
  plan_3_price_description: string;
  plan_3_icon: string;
  plan_3_feature_1: string;
  plan_3_feature_2: string;
  plan_3_feature_3: string;
  plan_3_feature_4: string;
  plan_3_feature_5: string;
  plan_3_button_text: string;
  plan_3_button_link: string;
}
