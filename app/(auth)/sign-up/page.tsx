import Image from "next/image";
import Link from "next/link";
import SocialAuthForm from "../../../components/forms/socialauthform";

const SignUpPage = () => {
  return (
   <div className="flex flex-col gap-6">

      {/* HEADER */}
      <div className="flex items-start justify-between">

        {/* TEXT */}
        <div className="space-y-2">

          <h1 className="h2-bold">
  <span className="text-primary-500">Join Dev</span>
  <span className="text-black dark:text-white">Flow</span>
</h1>

          <p className="text-sm text-dark500_light400">
            To get your questions answered!
          </p>

          <Link href="/sign-up" className="text-sm text-primary-500">
            Sign Up
          </Link>

        </div>

        {/* LOGO */}
        <Image
          src="/images/logo.svg"
          alt="DevFlow logo"
          width={120}
          height={40}
          className="object-contain"
        />

      </div>

      {/* SOCIAL BUTTONS */}
      <SocialAuthForm />

    </div>
  );
};

export default SignUpPage;