import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container(props: Readonly<ContainerProps>) {
  return (
    <div
      className={`container max-w-7xl px-4 py-4 mx-auto lg:px-8 xl:px-8 ${
        props.className ? props.className : ""
      }`}>
      {props.children}
    </div>
  );
}

