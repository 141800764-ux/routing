import React from "react";
import Link from "next/link";
import Image from "next/image";
import MobileNavigation from "./MobileNavigation";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between fixed top-0 z-50 w-full gap-5 p-6 sm:px-12 bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-md">

      {/* LEFT - LOGO */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/assets/images/logo.svg"
          width={23}
          height={23}
          alt="DevFlow Logo"
        />

        <p className="text-2xl font-bold text-black dark:text-white max-sm:hidden">
          Dev<span className="text-blue-500">Flow</span>
        </p>
      </Link>

      {/* CENTER LINKS */}
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-gray-300">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-5">
        <p className="text-sm text-gray-600 dark:text-gray-300 max-md:hidden">
          Global Search
        </p>

        <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-sm max-md:hidden">
          Theme
        </button>

        {/* MOBILE NAV */}
        <MobileNavigation />
      </div>

    </nav>
  );
};

export default Navbar;