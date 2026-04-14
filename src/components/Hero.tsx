import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import heroImg from "../../public/img/hero.png";
import { PlayCircleIcon } from "@heroicons/react/24/solid";
import { ArrowDownOnSquareIcon } from "@heroicons/react/24/outline";

type HeroProps = {
  data?: {
    title?: string;
    subtitle?: string;
    button_primary_text?: string;
    button_primary_url?: string;
    button_secondary_text?: string;
    button_secondary_url?: string;
    image?: string;
  } | null;
};

export const Hero = ({ data }: HeroProps) => {
  const imageSrc = data?.image
    ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${data.image}`
    : heroImg;

  return (
    <Container className="flex flex-wrap">
      <div className="flex items-center w-full lg:w-1/2">
        <div className="max-w-2xl mb-8">
          <h1 className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight dark:text-white">
            {data?.title ?? "Online Teaching Platform for Small Groups"}
          </h1>

          <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
            {data?.subtitle ??
              "TAMAMAT is designed for Direct Method teaching and small group lessons of up to 8 students - perfect for language schools and beyond! Keep your students engaged with dynamic question-switching, ensuring active participation and focus. Our shortcut selection tools make managing group lessons effortless, interactive, and highly effective."}
          </p>

          <div className="flex flex-col items-start space-y-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <Link
              href={data?.button_primary_url ?? "#"}
              className="px-8 py-4 text-lg font-medium text-center text-white bg-primary rounded-md hover:bg-primary/90 flex items-center gap-2"
            >
              <ArrowDownOnSquareIcon className="w-5 h-5" />
              <span>{data?.button_primary_text ?? "How it Works"}</span>
            </Link>

            <Link
              href={data?.button_secondary_url ?? "#"}
              className="flex items-center space-x-2 text-gray-500 dark:text-gray-400"
            >
              <PlayCircleIcon className="w-5 h-5" />
              <span>{data?.button_secondary_text ?? "Watch Video"}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center w-full lg:w-1/2">
        <div>
          <Image
            src={imageSrc}
            width={616}
            height={617}
            className="object-cover"
            alt={data?.title ?? "Hero Illustration"}
            priority
          />
        </div>
      </div>
    </Container>
  );
};