import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import { HeaderText } from "../_components/header-text";
import { SignUpForm } from "./_components/signup-form";

export const metadata: Metadata = { title: "Sign Up" };

const SignUpPage = () => {
  return (
    <div className="">
      <div className="mt-8 flex items-center justify-center gap-2 text-4xl md:mt-10 md:text-6xl lg:mt-12 lg:text-9xl">
        <Link href="/" className="transition hover:text-zinc-400">
          Dimensions
        </Link>
        <ArrowRight className="size-10" /> Register
      </div>
      <div className="mt-20 flex flex-col items-center justify-center">
        <div className="w-fit rounded-sm bg-[#F0F1F4] p-6 lg:w-[58rem]">
          <HeaderText
            firstHeading="Welcome to dimensions, we love to see you here"
            link="login"
            secondHeading=" Already have an account? Please proceed to our"
            href="/login"
          />
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
