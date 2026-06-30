"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type UserResult = {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
};

export default function GlobalSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("query") || "";

  const [search, setSearch] = useState(initialQuery);
  const [results, setResults] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ UPDATE URL (GLOBAL SYNC)
  useEffect(() => {
    if (search === initialQuery) return;

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (search) {
        params.set("query", search);
      } else {
        params.delete("query");
      }

      router.push(`/?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  // ✅ LIVE SEARCH API CALL
  useEffect(() => {
    const fetchResults = async () => {
      if (!search) {
        setResults([]);
        return;
      }

      setLoading(true);

      const res = await fetch(`/api/search?query=${search}`);
      const data = await res.json();

      setResults(data);
      setLoading(false);
    };

    const timeout = setTimeout(fetchResults, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="relative w-full max-w-xl">

      {/* INPUT */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-white/40" size={18} />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users, questions..."
          className="
            w-full
            bg-white/10
            border border-white/10
            rounded-xl
            pl-10 pr-10 py-2.5
            text-white text-sm
            outline-none
            focus:border-white/30
          "
        />

        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-3 text-white/40 hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* DROPDOWN RESULTS */}
      {search && (
        <div className="
          absolute mt-2 w-full
          bg-black/90 border border-white/10
          rounded-xl shadow-lg
          max-h-72 overflow-auto
          z-50
        ">
          {loading ? (
            <div className="p-3 text-white/50 text-sm">
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="p-3 text-white/50 text-sm">
              No results found
            </div>
          ) : (
            results.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer"
                onClick={() => router.push(`/profile/${user.id}`)}
              >
                <img
                  src={user.image || "/avatar.png"}
                  className="w-8 h-8 rounded-full"
                />

                <div>
                  <p className="text-white text-sm">
                    {user.name}
                  </p>
                  <p className="text-white/40 text-xs">
                    @{user.username}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}