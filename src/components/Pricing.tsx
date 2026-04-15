import { Container } from "./Container";
import { SectionTitle } from "./SectionTitle";
import { CheckIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export const Pricing = () => {
  return (
    <Container className="px-8">
      <SectionTitle
        title="Choose Your Plan"
      >
      </SectionTitle>

      <div className="grid gap-8 lg:grid-cols-3 xl:grid-cols-3">
        {/* Free Plan */}
        <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-8 rounded-2xl py-10 dark:bg-trueGray-800">
          <div>
            <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mb-6 mx-auto">
              <span className="text-xl font-bold text-white">$0</span>
            </div>

            <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
              Free
            </h3>

            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              Perfect for trying out TAMAMAT
            </p>

            <div className="text-center mb-8">
              <span className="text-4xl font-bold text-gray-800 dark:text-white">$0</span>
              <span className="text-gray-500 dark:text-gray-400">/month</span>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">2000 minutes monthly</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">30-minute lesson limit</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">1 classroom</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">All core features</span>
              </li>
            </ul>
          </div>

          <Link
            href="/signup"
            className="w-full px-6 py-3 text-center text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
          >
            Get Started Free
          </Link>
        </div>

        {/* Pay-as-You-Go Plan */}
        <div className="flex flex-col justify-between w-full h-full px-8 rounded-2xl py-10 relative" style={{backgroundColor: "#E0F2FE"}}>
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white px-4 py-1 rounded-full text-sm font-medium" style={{backgroundColor: "#3B82F6"}}>
            Most Popular
          </div>

          <div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full mb-6 mx-auto" style={{backgroundColor: "#3B82F6"}}>
              <span className="text-xl font-bold text-white">⚡</span>
            </div>

            <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
              Pay-as-You-Go
            </h3>

            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              Scale with your teaching needs
            </p>

            <div className="text-center mb-8">
              <span className="text-4xl font-bold text-gray-800 dark:text-white">$0.005</span>
              <span className="text-gray-500 dark:text-gray-400">/participant/minute</span>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <CheckIcon className="w-5 h-5 mr-3" style={{color: "#3B82F6"}} />
                <span className="text-gray-700 dark:text-gray-300">Unlimited lesson duration</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="w-5 h-5 mr-3" style={{color: "#3B82F6"}} />
                <span className="text-gray-700 dark:text-gray-300">Unlimited classrooms</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="w-5 h-5 mr-3" style={{color: "#3B82F6"}} />
                <span className="text-gray-700 dark-text-gray-300">Pay only for what you use</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="w-5 h-5 mr-3" style={{color: "#3B82F6"}} />
                <span className="text-gray-700 dark:text-gray-300">All premium features</span>
              </li>
            </ul>
          </div>

          <Link
            href="/signup"
            className="w-full px-6 py-3 text-center text-white rounded-md hover:opacity-90 transition-colors"
            style={{backgroundColor: "#3B82F6"}}
          >
            Start Pay-as-You-Go
          </Link>
        </div>

        {/* Custom Plan */}
        <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-8 rounded-2xl py-10 dark:bg-trueGray-800">
          <div>
            <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-full mb-6 mx-auto">
              <span className="text-xl font-bold text-white">🏢</span>
            </div>

            <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
              Custom
            </h3>

            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              For schools and enterprises
            </p>

            <div className="text-center mb-8">
              <span className="text-4xl font-bold text-gray-800 dark:text-white">Contact</span>
              <span className="text-gray-500 dark:text-gray-400"> us</span>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <CheckIcon className="w-5 h-5 text-purple-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Dedicated support</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="w-5 h-5 text-purple-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Custom integrations</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="w-5 h-5 text-purple-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Volume discounts</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="w-5 h-5 text-purple-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Priority support</span>
              </li>
            </ul>
          </div>

          <Link
            href="/contact"
            className="w-full px-6 py-3 text-center text-white bg-purple-500 rounded-md hover:bg-purple-600 transition-colors"
          >
            Contact Sales
          </Link>
        </div>
      </div>

    </Container>
  );
};