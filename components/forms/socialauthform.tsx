"use client";

import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

const SocialAuthForm = () => {
  return (
    <div className="mt-8 flex w-full gap-3">

      {/* GITHUB */}
      <Button className="flex w-1/2 items-center justify-center gap-2 background-dark400_light900">
        <Image
          src="/images/github.svg"
          alt="Github Logo"
          width={20}
          height={20}
        />
        <span>Login with GitHub</span>
      </Button>

      {/* GOOGLE */}
      <Button className="flex w-1/2 items-center justify-center gap-2 background-dark400_light900">
        <Image
          src="/images/google.svg"
          alt="Google Logo"
          width={20}
          height={20}
        />
        <span>Login with Google</span>
      </Button>

    </div>
  );
};

export default SocialAuthForm;