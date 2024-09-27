import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import { HeaderText } from "../_components/header-text";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = { title: "Login Page" };

const SignUpPage = () => {
  return (
    <div className="">
      <div className="mt-8 flex items-center justify-center gap-2 text-4xl md:mt-10 md:text-6xl lg:mt-12 lg:text-9xl">
        <Link href="/" className="transition hover:text-zinc-400">
          Dimensions
        </Link>
        <ArrowRight className="size-10" /> Login
      </div>
      <div className="mt-20 flex flex-col items-center justify-center">
        <div className="w-fit rounded-sm bg-[#F0F1F4] p-6 lg:w-[58rem]">
          <HeaderText
            firstHeading="Hey, Welcome back to dimensions"
            link="Sign Up"
            secondHeading="Don't have an account? Please proceed to our"
            href="/signup"
          />
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
