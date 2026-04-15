import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import heroImg from "../../public/img/hero.png";
import { PlayCircleIcon } from "@heroicons/react/24/solid";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";

export const Hero = () => {
  return (
    <Container className="flex flex-wrap">
      <div className="flex items-center w-full lg:w-1/2">
        <div className="max-w-2xl mb-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-5xl xl:leading-tight dark:text-white">
            Online Teaching Platform for Small Groups
          </h1>

          <p className="py-5 text-xl leading-relaxed lg:leading-loose text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
            TAMAMAT is designed for Direct Method teaching and small group lessons
            of up to 8 students - perfect for language schools and beyond! Keep
            your students engaged with dynamic question-switching, ensuring active
            participation and focus. Our shortcut selection tools make managing
            group lessons effortless, interactive, and highly effective.
          </p>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="#how-it-works"
              className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white px-5 py-2.5 rounded-[25px] font-semibold text-sm shadow-[0_8px_20px_rgba(59,130,246,0.3)] transition-all duration-300 hover:transform hover:translate-y-[-1px] hover:shadow-[0_10px_20px_rgba(59,130,246,0.4)] whitespace-nowrap inline-flex items-center"
            >
              How it Works
              <ArrowDownCircleIcon className="w-4 h-4 ml-2" />
            </Link>

            <Link
              href="#"
              className="flex items-center gap-2 text-gray-500 dark:text-gray-400"
            >
              <PlayCircleIcon className="w-5 h-5" />
              <span>Watch Video</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center w-full lg:w-1/2">
        <div>
          <Image
            src={heroImg}
            width={493}
            height={494}
            className="object-cover"
            alt="Online Teaching Platform for Small Groups"
            priority
          />
        </div>
      </div>
    </Container>
  );
};