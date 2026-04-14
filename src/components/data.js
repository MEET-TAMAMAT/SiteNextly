import {
  EnvelopeIcon,
  UsersIcon,
  ChartBarSquareIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/solid";

import benefitOneImg from "../../public/img/benefit-one.png";
import benefitTwoImg from "../../public/img/benefit-two.png";

const benefitOne = {
  title: "Simple and Effective Teaching Tools",
  desc: "TAMAMAT provides everything you need to run engaging small group lessons with ease. Our platform is designed specifically for language schools and educators who want to maximize student participation.",
  image: benefitOneImg,
  bullets: [
    {
      title: "Simple Invitations",
      desc: "Email-based class access with permanent links. Students can join your classroom with just one click.",
      icon: <EnvelopeIcon />,
    },
    {
      title: "Student Management",
      desc: "Easily add and remove students from your dashboard. Keep your classroom organized and up-to-date.",
      icon: <UsersIcon />,
    },
    {
      title: "Participation Insights",
      desc: "Monthly statistics help you track student engagement and participation patterns.",
      icon: <ChartBarSquareIcon />,
    },
  ],
};

const benefitTwo = {
  title: "Accessible and User-Friendly",
  desc: "No complex setup or software installations required. TAMAMAT works seamlessly across all devices, giving you complete control over your virtual classroom experience.",
  image: benefitTwoImg,
  bullets: [
    {
      title: "Device Friendly",
      desc: "Works perfectly on desktop, tablet, and mobile with responsive design that adapts to any screen size.",
      icon: <DevicePhoneMobileIcon />,
    },
    {
      title: "No App Needed",
      desc: "Browser-based platform means no software installation required. Just open your browser and start teaching.",
      icon: <GlobeAltIcon />,
    },
    {
      title: "Teacher Control",
      desc: "Complete control over student participation and selection. Manage your classroom your way.",
      icon: <AdjustmentsHorizontalIcon />,
    },
  ],
};


export {benefitOne, benefitTwo};
