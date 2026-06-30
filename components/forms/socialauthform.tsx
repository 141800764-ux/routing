"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

type Props = {
  type?: "sign-in" | "sign-up";
};

const SocialAuthForm = ({ type = "sign-in" }: Props) => {
  const [loadingProvider, setLoadingProvider] = useState<
    "github" | "google" | null
  >(null);

  const handleSignIn = async (provider: "github" | "google") => {
    try {
      setLoadingProvider(provider);

      await signIn(provider, {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="mt-8 flex w-full gap-3">

      <Button
        type="button"
        onClick={() => handleSignIn("github")}
        disabled={!!loadingProvider}
        className="flex w-1/2 items-center justify-center gap-2 bg-white text-black"
      >
        <Image src="/images/github.svg" alt="GitHub" width={20} height={20} />

        {loadingProvider === "github"
          ? "Connecting..."
          : type === "sign-in"
          ? "GitHub"
          : "GitHub"}
      </Button>

      <Button
        type="button"
        onClick={() => handleSignIn("google")}
        disabled={!!loadingProvider}
        className="flex w-1/2 items-center justify-center gap-2 bg-white text-black"
      >
        <Image src="/images/google.svg" alt="Google" width={20} height={20} />

        {loadingProvider === "google"
          ? "Connecting..."
          : type === "sign-in"
          ? "Google"
          : "Google"}
      </Button>

    </div>
  );
};

export default SocialAuthForm;