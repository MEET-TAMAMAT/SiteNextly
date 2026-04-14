import Image from "next/image";
import React from "react";
import { Container } from "@/components/Container";

import userOneImg from "../../public/img/user1.jpg";
import userTwoImg from "../../public/img/user2.jpg";
import userThreeImg from "../../public/img/user3.jpg";

export const Testimonials = () => {
  return (
    <Container>
      {/* First row - 2 testimonials */}
      <div className="grid gap-10 lg:grid-cols-2 mb-10">
        <div>
          <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-10 rounded-2xl py-10 dark:bg-trueGray-800">
            <p className="text-xl leading-normal">
              &ldquo;This platform finally makes small group lessons feel <Mark>organized</Mark>.
              The automatic student selection keeps everyone involved, and the simple classroom links
              make it incredibly easy for my students to join.&rdquo;
            </p>

            <Avatar
              image={userOneImg}
              name="Daniel Novak"
              title="School Owner"
            />
          </div>
        </div>

        <div>
          <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-10 rounded-2xl py-10 dark:bg-trueGray-800">
            <p className="text-xl leading-normal">
              &ldquo;Managing participation used to be stressful in my online classes. Now the system
              randomly selects students for questions, which keeps everyone <Mark>alert and engaged</Mark>.
              My students know they can be called anytime.&rdquo;
            </p>

            <Avatar
              image={userTwoImg}
              name="Maria Garcia"
              title="Language Coach"
            />
          </div>
        </div>
      </div>

      {/* Second row - 3 testimonials */}
      <div className="grid gap-10 lg:grid-cols-3">
        <div>
          <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-8 rounded-2xl py-10 dark:bg-trueGray-800">
            <p className="text-lg leading-normal">
              &ldquo;What I appreciate most is how <Mark>little setup</Mark> is required.
              I send one link and my students are ready to learn. No downloads, no confusion.&rdquo;
            </p>

            <Avatar
              image={userThreeImg}
              name="Sofia Kos"
              title="English Teacher"
            />
          </div>
        </div>

        <div>
          <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-8 rounded-2xl py-10 dark:bg-trueGray-800">
            <p className="text-lg leading-normal">
              &ldquo;The <Mark>simplicity</Mark> is what convinced me to switch.
              Invitations take seconds to send, and students enter the classroom with a single click.&rdquo;
            </p>

            <Avatar
              image={userOneImg}
              name="Matt Brandon"
              title="Director of Studies"
            />
          </div>
        </div>

        <div>
          <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-8 rounded-2xl py-10 dark:bg-trueGray-800">
            <p className="text-lg leading-normal">
              &ldquo;<Mark>Interaction is essential</Mark> in my field. This platform keeps
              the lesson dynamic by selecting students randomly. It creates a lively atmosphere.&rdquo;
            </p>

            <Avatar
              image={userTwoImg}
              name="Anton Markov"
              title="Pronunciation Coach"
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

interface AvatarProps {
  image: any;
  name: string;
  title: string;
}

function Avatar(props: Readonly<AvatarProps>) {
  return (
    <div className="flex items-center mt-8 space-x-3">
      <div className="flex-shrink-0 overflow-hidden rounded-full w-14 h-14">
        <Image
          src={props.image}
          width="40"
          height="40"
          alt="Avatar"
          placeholder="blur"
        />
      </div>
      <div>
        <div className="text-lg font-medium">{props.name}</div>
        <div className="text-gray-600 dark:text-gray-400">{props.title}</div>
      </div>
    </div>
  );
}

function Mark(props: { readonly children: React.ReactNode }) {
  return (
    <>
      {" "}
      <mark className="rounded-md ring-4" style={{color: "#1E40AF", backgroundColor: "#DBEAFE", ringColor: "#DBEAFE"}}>
        {props.children}
      </mark>{" "}
    </>
  );
}
