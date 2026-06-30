"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import SocialAuthForm from "./socialauthform";

// =============================
// SCHEMAS
// =============================
const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

const signUpSchema = z.object({
  name: z.string().min(3),
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = {
  name?: string;
  username?: string;
  email: string;
  password: string;
};

// =============================
const AuthForms = ({ type }: { type: "sign-in" | "sign-up" }) => {
  const [isSignUp, setIsSignUp] = useState(type === "sign-up");
  const [loading, setLoading] = useState(false);

  const schema = isSignUp ? signUpSchema : signInSchema;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    setLoading(true);

    try {
      if (isSignUp) {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        // 🔥 real backend error logging
        if (!res.ok) {
          console.log("SERVER ERROR:", data);
          throw new Error(data.error || "Signup failed");
        }

        await signIn("credentials", {
          email: values.email,
          password: values.password,
          callbackUrl: "/dashboard",
        });
      } else {
        const res = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (res?.error) {
          alert(res.error || "Invalid credentials");
          return;
        }

        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">

      <h2 className="text-2xl font-bold text-center">
        {isSignUp ? "Create Account" : "Welcome Back"}
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {isSignUp && (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
          </Button>

        </form>
      </Form>

      {/* SOCIAL LOGIN */}
      <SocialAuthForm type={isSignUp ? "sign-up" : "sign-in"} />

      <p className="text-center text-sm">
        {isSignUp ? "Already have an account?" : "Don’t have an account?"}

        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="ml-1 text-blue-500 font-medium"
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </p>

    </div>
  );
};

export default AuthForms;