import { Container } from "./Container";
import { SectionTitle } from "./SectionTitle";
import { CheckIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { getPricingContent } from "@/lib/directus";
import { getEditableAttributes } from "@/lib/visual-editor";

// SVG icon components mapping
const iconMap = {
  sparkles: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
      <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
    </svg>
  ),
  rocket: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
      <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" clipRule="evenodd" />
      <path d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.51c0-1.23.592-2.323 1.51-3.008Z" />
    </svg>
  ),
  settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
      <path fillRule="evenodd" d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
    </svg>
  )
};

// Helper function to render a pricing plan
function PricingPlan({ plan, planNumber, dataId }: { plan: any; planNumber: number; dataId: string | number }) {
  const IconComponent = iconMap[plan.icon as keyof typeof iconMap] || iconMap.sparkles;

  const features = [
    plan.feature_1,
    plan.feature_2,
    plan.feature_3,
    plan.feature_4,
    plan.feature_5,
  ].filter(Boolean);

  return (
    <div className="flex flex-col justify-between w-full h-full px-8 rounded-2xl py-10 shadow-lg dark:shadow-[0_10px_40px_rgba(255,255,255,0.1)]">
      <div>
        <h3
          className="text-2xl font-bold text-center mb-6"
          style={{ color: plan.color }}
          {...getEditableAttributes('pricing_section', dataId, `plan_${planNumber}_name`)}
        >
          {plan.name}
        </h3>

        <div className="text-center mb-8">
          <span
            className="text-3xl font-bold my-8"
            style={{ color: plan.color }}
            {...getEditableAttributes('pricing_section', dataId, `plan_${planNumber}_price`)}
          >
            {plan.price}
          </span>
          {plan.price_description && (
            <span
              className="text-gray-500 dark:text-gray-400"
              {...getEditableAttributes('pricing_section', dataId, `plan_${planNumber}_price_description`)}
            >
              {plan.price_description}
            </span>
          )}
          <div className="flex justify-center mt-6" style={{ color: plan.color }}>
            <IconComponent />
          </div>
        </div>

        <ul className="space-y-3 mb-8">
          {features.map((feature: string, index: number) => (
            <li
              key={index}
              className="flex items-center"
              {...getEditableAttributes('pricing_section', dataId, `plan_${planNumber}_feature_${index + 1}`)}
            >
              <CheckIcon className="w-7 h-7 mr-3" style={{ color: plan.color }} />
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={plan.button_link}
        className={`w-[62.5%] mx-auto px-6 py-3 text-center rounded-[25px] font-semibold transition-all duration-300 hover:transform hover:translate-y-[-1px] hover:text-white border ${
          plan.color === '#22c55e'
            ? 'text-[#22c55e] border-[#22c55e] shadow-[0_4px_12px_rgba(34,197,94,0.15)] hover:bg-[#22c55e] hover:shadow-[0_8px_20px_rgba(34,197,94,0.25)]'
            : plan.color === '#f4a300'
            ? 'text-[#f4a300] border-[#f4a300] shadow-[0_4px_12px_rgba(244,163,0,0.15)] hover:bg-[#f4a300] hover:shadow-[0_8px_20px_rgba(244,163,0,0.25)]'
            : plan.color === '#a855f7'
            ? 'text-[#a855f7] border-[#a855f7] shadow-[0_4px_12px_rgba(168,85,247,0.15)] hover:bg-[#a855f7] hover:shadow-[0_8px_20px_rgba(168,85,247,0.25)]'
            : ''
        }`}
        {...getEditableAttributes('pricing_section', dataId, `plan_${planNumber}_button_text`)}
      >
        {plan.button_text}
      </Link>
    </div>
  );
}

export const Pricing = async () => {
  const content = await getPricingContent();

  // Fallback content if Directus fetch fails
  const fallbackContent = {
    id: 1,
    main_title: "Pick Your Plan",
    plan_1_name: "Free Plan",
    plan_1_color: "#22c55e",
    plan_1_price: "$0",
    plan_1_price_description: "/ mo",
    plan_1_icon: "sparkles",
    plan_1_feature_1: "2000 free minutes a month",
    plan_1_feature_2: "30 minute limit per lesson",
    plan_1_feature_3: "1 permanent classroom link",
    plan_1_feature_4: "Standard video quality",
    plan_1_feature_5: "Perfect for trying the platform",
    plan_1_button_text: "Get Started",
    plan_1_button_link: "/signup",
    plan_2_name: "Pay-as-You-Go",
    plan_2_color: "#f4a300",
    plan_2_price: "$0.005",
    plan_2_price_description: "/ participant / minute",
    plan_2_icon: "rocket",
    plan_2_feature_1: "Pay only for what you use",
    plan_2_feature_2: "No monthly commitment",
    plan_2_feature_3: "No lesson time limits",
    plan_2_feature_4: "Unlimited classrooms",
    plan_2_feature_5: "Priority support",
    plan_2_button_text: "Start Paying",
    plan_2_button_link: "/signup",
    plan_3_name: "Custom",
    plan_3_color: "#a855f7",
    plan_3_price: "Contact Us",
    plan_3_price_description: "",
    plan_3_icon: "settings",
    plan_3_feature_1: "Tailored solutions",
    plan_3_feature_2: "Dedicated account manager",
    plan_3_feature_3: "Priority support",
    plan_3_feature_4: "Custom integrations",
    plan_3_feature_5: "Custom branding",
    plan_3_button_text: "Contact Now",
    plan_3_button_link: "/contact",
  };

  const data = content || fallbackContent;
  const isUsingDirectus = !!content;

  // Create plans array for easier iteration
  const plans = [
    {
      name: data.plan_1_name,
      color: data.plan_1_color,
      price: data.plan_1_price,
      price_description: data.plan_1_price_description,
      icon: data.plan_1_icon,
      feature_1: data.plan_1_feature_1,
      feature_2: data.plan_1_feature_2,
      feature_3: data.plan_1_feature_3,
      feature_4: data.plan_1_feature_4,
      feature_5: data.plan_1_feature_5,
      button_text: data.plan_1_button_text,
      button_link: data.plan_1_button_link,
    },
    {
      name: data.plan_2_name,
      color: data.plan_2_color,
      price: data.plan_2_price,
      price_description: data.plan_2_price_description,
      icon: data.plan_2_icon,
      feature_1: data.plan_2_feature_1,
      feature_2: data.plan_2_feature_2,
      feature_3: data.plan_2_feature_3,
      feature_4: data.plan_2_feature_4,
      feature_5: data.plan_2_feature_5,
      button_text: data.plan_2_button_text,
      button_link: data.plan_2_button_link,
    },
    {
      name: data.plan_3_name,
      color: data.plan_3_color,
      price: data.plan_3_price,
      price_description: data.plan_3_price_description,
      icon: data.plan_3_icon,
      feature_1: data.plan_3_feature_1,
      feature_2: data.plan_3_feature_2,
      feature_3: data.plan_3_feature_3,
      feature_4: data.plan_3_feature_4,
      feature_5: data.plan_3_feature_5,
      button_text: data.plan_3_button_text,
      button_link: data.plan_3_button_link,
    },
  ];

  return (
    <Container className="px-4 lg:px-8">
      {/* Debug indicator */}
      <div className="text-xs text-center mb-4 opacity-50">
        Pricing Data: {isUsingDirectus ? '🟢 Directus CMS' : '🔴 Fallback (hardcoded)'}
      </div>

      <SectionTitle
        title={data.main_title}
        {...getEditableAttributes('pricing_section', data.id, 'main_title')}
      >
      </SectionTitle>

      <div className="grid gap-8 lg:grid-cols-3 xl:grid-cols-3">
        {plans.map((plan, index) => (
          <PricingPlan key={index} plan={plan} planNumber={index + 1} dataId={data.id} />
        ))}
      </div>
    </Container>
  );
};