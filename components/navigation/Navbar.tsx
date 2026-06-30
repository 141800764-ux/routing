"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import MobileNavigation from "./navbar/MobileNavigation";
import { useSession } from "next-auth/react";
import UserAvatar from "@/components/UserAvatar";

import GlobalSearch from "@/components/search/GlobalSearch";

const Navbar = () => {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 h-20 flex items-center justify-between px-6 bg-white/80 dark:bg-black/80 backdrop-blur border-b">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <MobileNavigation />

        <Link href="/" className="flex items-center gap-3 h-full py-2">
  <Image
    src="/images/Devflogo1.png"
    width={64}
    height={64}
    alt="DevFlow Logo"
    className="h-16 w-16 object-contain"
    priority
  />
  <span className="font-bold text-2xl whitespace-nowrap">DevFlow</span>
</Link>
      </div>

      {/* CENTER SEARCH (NEW) */}
      <div className="hidden md:block w-[420px]">
        <GlobalSearch />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        <button
          onClick={() =>
            setTheme(theme === "dark" ? "light" : "dark")
          }
          className="px-3 py-1 border rounded text-sm"
        >
          {!mounted ? "..." : theme === "dark" ? "🌞 Light" : "🌙 Dark"}
        </button>

        {session?.user && (
          <UserAvatar
            id={(session.user as any).id}
            name={session.user.name || "User"}
            imageUrl={session.user.image}
            className="h-10 w-10"
          />
        )}

      </div>

    </nav>
  );
};

export default Navbar;