import React from "react";
import { Container } from "@/components/Container";

interface SectionTitleProps {
  preTitle?: string;
  title?: string;
  align?: "left" | "center";
  children?: React.ReactNode;
  [key: string]: unknown; // ← allows data-directus and other HTML attributes
}

export const SectionTitle = (props: Readonly<SectionTitleProps>) => {
  const { preTitle, title, align, children, ...rest } = props;

  return (
    <Container
      className={`flex w-full flex-col mt-4 ${
        align === "left" ? "" : "items-center justify-center text-center"
      }`}>
      {preTitle && (
        <div className="text-sm font-bold tracking-wider uppercase" style={{color: "#3B82F6"}}>
          {preTitle}
        </div>
      )}

      {title && (
        <h2
          className="max-w-2xl mt-3 text-2xl font-bold leading-snug tracking-tight text-gray-800 lg:leading-tight lg:text-4xl dark:text-white"
          {...rest}  // ← forwards data-directus to the h2
        >
          {title}
        </h2>
      )}

      {children && (
        <p className="max-w-2xl py-4 text-lg leading-normal text-gray-500 lg:text-xl xl:text-xl dark:text-gray-300">
          {children}
        </p>
      )}
    </Container>
  );
}
