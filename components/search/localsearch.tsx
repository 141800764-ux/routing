"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function LocalSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const initialQuery = searchParams.get("query") || "";
  const [search, setSearch] = useState(initialQuery);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (search) {
        params.set("query", search);
      } else {
        params.delete("query");
      }

      router.push(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, pathname]);

  return (
    <div className="relative w-full">

      {/* ICON */}
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
      />

      {/* INPUT */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search this page..."
        className="
          w-full
          bg-white/10
          border border-white/10
          rounded-xl
          pl-10 pr-10 py-2.5
          text-sm text-white
          outline-none
          focus:border-white/20
        "
      />

      {/* CLEAR */}
      {search && (
        <button
          onClick={() => setSearch("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}