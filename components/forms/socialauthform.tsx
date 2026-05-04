"use client";

import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";

const SocialAuthForm = () => {
  const handleSignIn = async (provider: "github" | "google") => {
    try {
      await signIn(provider, {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.log(error);

      toast({
        title: "Sign in failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-8 flex w-full gap-3">
      {/* GITHUB */}
      <Button
        onClick={() => handleSignIn("github")}
        className="flex w-1/2 items-center justify-center gap-2 background-dark400_light900"
      >
        <Image
          src="/images/github.svg"
          alt="Github Logo"
          width={20}
          height={20}
        />
        <span>Login with GitHub</span>
      </Button>

      {/* GOOGLE */}
      <Button
        onClick={() => handleSignIn("google")}
        className="flex w-1/2 items-center justify-center gap-2 background-dark400_light900"
      >
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