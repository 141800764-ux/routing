"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, X, Bookmark } from "lucide-react";
import { useSession, signIn } from "next-auth/react";

type SavedItem = {
  _id: string;
  question: string;
  questionTitle: string;
  createdAt: string;
};

export default function CollectionsPage() {
  const { data: session } = useSession();
  const [collections, setCollections] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    const fetchCollections = async () => {
      try {
        const params = new URLSearchParams();
        if (search) params.set("query", search);

        const res = await fetch(`/api/collections?${params.toString()}`);
        const data = await res.json();

        if (data.success) setCollections(data.collections);
      } catch (err) {
        console.error("Failed to load collections:", err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchCollections, 300);
    return () => clearTimeout(timeout);
  }, [search, session]);

  const unsave = async (questionId: string) => {
    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId }),
      });

      const data = await res.json();

      if (data.success && !data.saved) {
        setCollections((prev) =>
          prev.filter((c) => c.question !== questionId)
        );
      }
    } catch (err) {
      console.error("Failed to unsave:", err);
    }
  };

  if (!session) {
    return (
      <div className="p-6 text-center">
        <p className="text-white/50 mb-4">
          You must be logged in to view your saved questions.
        </p>
        <button
          onClick={() => signIn()}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-xl text-white font-semibold text-sm transition"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-bold text-white">Saved Questions</h1>

      {/* SEARCH */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 text-white/40" size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search saved questions..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-white text-sm outline-none focus:border-orange-500/50"
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

      {/* SAVED QUESTIONS */}
      {loading ? (
        <p className="text-white">Loading...</p>
      ) : collections.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark size={40} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/50">No saved questions yet.</p>
          <Link
            href="/"
            className="text-orange-400 text-sm hover:underline mt-2 inline-block"
          >
            Browse questions
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {collections.map((c) => (
            <div
              key={c._id}
              className="rounded-2xl border border-white/10 bg-[#111827] p-5 hover:border-orange-500/40 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <Link href={`/question/${c.question}`} className="flex-1">
                  <h2 className="text-lg font-bold text-white hover:text-orange-400 transition">
                    {c.questionTitle || "Untitled Question"}
                  </h2>
                </Link>

                <button
                  onClick={() => unsave(c.question)}
                  className="text-orange-500 hover:text-white/40 transition flex-shrink-0"
                  title="Remove from saved"
                >
                  <Bookmark size={18} fill="currentColor" />
                </button>
              </div>

              <p className="text-white/30 text-xs mt-2">
                Saved on{" "}
                {new Date(c.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}