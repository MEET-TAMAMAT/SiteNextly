import Image from "next/image";
import { Container } from "./Container";
import { SectionTitle } from "./SectionTitle";
import {
  EnvelopeIcon,
  UsersIcon,
  ChartBarSquareIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/solid";
import { getFeaturesContent, getImageUrl } from "@/lib/directus";

// Icon mapping object
const iconMap = {
  EnvelopeIcon: EnvelopeIcon,
  UsersIcon: UsersIcon,
  ChartBarSquareIcon: ChartBarSquareIcon,
  DevicePhoneMobileIcon: DevicePhoneMobileIcon,
  GlobeAltIcon: GlobeAltIcon,
  AdjustmentsHorizontalIcon: AdjustmentsHorizontalIcon,
};

// Helper function to render a feature block
function FeatureBlock({ icon, title, description, index }: {
  icon: string;
  title: string;
  description: string;
  index: number;
}) {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || EnvelopeIcon;

  return (
    <div className="rounded-lg px-2 py-1" key={index}>
      <div className="flex items-center mb-0">
        <div className="w-6 h-10 rounded-lg flex items-center justify-center mr-1">
          <IconComponent className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-base">{description}</p>
    </div>
  );
}

export const Features = async () => {
  const content = await getFeaturesContent();

  // Fallback content if Directus fetch fails
  const fallbackContent = {
    main_title: "Built for Small Groups",
    main_image: null,
    feature_1_icon: "EnvelopeIcon",
    feature_1_title: "Simple Invitations",
    feature_1_description: "Email-based class access with permanent links. Students can join your classroom with just one click.",
    feature_2_icon: "UsersIcon",
    feature_2_title: "Student Management",
    feature_2_description: "Easily add and remove students from your dashboard. Keep your classroom organized and up-to-date.",
    feature_3_icon: "ChartBarSquareIcon",
    feature_3_title: "Participation Insights",
    feature_3_description: "Monthly statistics help you track student engagement and participation patterns.",
    feature_4_icon: "DevicePhoneMobileIcon",
    feature_4_title: "Device Friendly",
    feature_4_description: "Works perfectly on desktop, tablet, and mobile with responsive design that adapts to any screen size.",
    feature_5_icon: "GlobeAltIcon",
    feature_5_title: "No App Needed",
    feature_5_description: "Browser-based platform means no software installation required. Just open your browser and start teaching.",
    feature_6_icon: "AdjustmentsHorizontalIcon",
    feature_6_title: "Teacher Control",
    feature_6_description: "Complete control over student participation and selection. Manage your classroom your way.",
  };

  const data = content || fallbackContent;
  const isUsingDirectus = !!content;

  // Create features array for easier iteration
  const features = [
    { icon: data.feature_1_icon, title: data.feature_1_title, description: data.feature_1_description },
    { icon: data.feature_2_icon, title: data.feature_2_title, description: data.feature_2_description },
    { icon: data.feature_3_icon, title: data.feature_3_title, description: data.feature_3_description },
    { icon: data.feature_4_icon, title: data.feature_4_title, description: data.feature_4_description },
    { icon: data.feature_5_icon, title: data.feature_5_title, description: data.feature_5_description },
    { icon: data.feature_6_icon, title: data.feature_6_title, description: data.feature_6_description },
  ];

  return (
    <Container className="px-4 lg:px-8">
      {/* Debug indicator */}
      <div className="text-xs text-center mb-4 opacity-50">
        Features Data: {isUsingDirectus ? '🟢 Directus CMS' : '🔴 Fallback (hardcoded)'}
      </div>

      <SectionTitle title={data.main_title}>
      </SectionTitle>

      <div className="grid gap-0 lg:grid-cols-5 items-center">
        {/* Left side - Feature blocks */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <FeatureBlock
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Right side - Image */}
        <div className="lg:col-span-2">
          <div className="relative flex justify-center">
            <Image
              src={
                data.main_image && typeof data.main_image === 'object' && 'id' in data.main_image
                  ? getImageUrl(data.main_image.id)
                  : "/img/Num-5-All-Mute.png"
              }
              alt="TAMAMAT Features Interface"
              width={350}
              height={351}
              className="max-w-full h-auto rounded-lg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};