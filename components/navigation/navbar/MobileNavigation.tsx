"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function MobileNavigation() {
  const { data: session } = useSession();

  return (
    <Sheet>
      {/* HAMBURGER */}
      <SheetTrigger asChild>
        <button className="text-3xl p-2">
          ☰
        </button>
      </SheetTrigger>

      {/* MENU */}
      <SheetContent side="left" className="w-[280px] flex flex-col">
        {/* HEADER */}
        <SheetHeader>
          <SheetTitle className="text-lg font-bold">
            Menu
          </SheetTitle>
        </SheetHeader>

        {/* TOP NAV LINKS */}
        <div className="flex flex-col gap-4 mt-6 text-base font-medium">
          <Link href="/">Home</Link>
          <Link href="/community">Community</Link>
          <Link href="/collections">Collections</Link>
          <Link href="/jobs">Find a Job</Link>
          <Link href={session?.user ? `/profile/${(session.user as any).id}` : "/sign-in"}>Profile</Link>
          <Link href="/ask">Ask a Question</Link>
        </div>

        {/* AUTH SECTION */}
        <div className="mt-auto pt-6 border-t flex flex-col gap-3">
          {session?.user ? (
            <button
              onClick={() =>
                signOut({
                  callbackUrl: "/sign-in",
                })
              }
              className="text-center px-4 py-2 border rounded-md"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-center px-4 py-2 border rounded-md"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="text-center px-4 py-2 bg-black text-white rounded-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}