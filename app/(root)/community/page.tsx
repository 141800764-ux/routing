"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, MessageSquareText } from "lucide-react";

type CommunityUser = {
  _id: string;
  name: string;
  username: string;
  email: string;
  image: string;
  questionCount: number;
  topTag: string | null;
};

type PopularTag = {
  name: string;
  count: number;
};

const TAG_COLORS: Record<string, string> = {
  javascript: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  typescript: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  react: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  nextjs: "bg-white/10 text-white/80 border-white/20",
  python: "bg-green-500/10 text-green-400 border-green-500/20",
  nodejs: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  css: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  html: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  mongodb: "bg-green-600/10 text-green-500 border-green-600/20",
  sql: "bg-sky-500/10 text-sky-400 border-sky-500/20",
};

const getTagColor = (name: string) =>
  TAG_COLORS[name.toLowerCase()] ??
  "bg-orange-500/10 text-orange-400 border-orange-500/20";

export default function CommunityPage() {
  const [users, setUsers] = useState<CommunityUser[]>([]);
  const [popularTags, setPopularTags] = useState<PopularTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const params = new URLSearchParams();
        if (search) params.set("query", search);

        const res = await fetch(`/api/users?${params.toString()}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (data.success) {
          setUsers(data.users);
          setPopularTags(data.popularTags || []);
        }
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-bold text-white">Community</h1>

      {/* SEARCH */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 text-white/40" size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or username..."
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

      {/* MAIN CONTENT */}
      <div className="flex gap-6">

        {/* LEFT — user grid */}
        <div className="flex-1">
          {loading ? (
            <p className="text-white">Loading...</p>
          ) : users.length === 0 ? (
            <p className="text-white/50">No users found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <Link
                  key={user._id}
                  href={`/profile/${user._id}`}
                  className="rounded-2xl border border-white/10 bg-[#111827] p-5 hover:border-orange-500/40 transition flex flex-col items-center text-center"
                >
                  <Image
                    src={user.image || "/avatar.png"}
                    alt={user.name || "User"}
                    width={64}
                    height={64}
                    className="rounded-full mb-3"
                  />
                  <p className="text-white font-semibold">
                    {user.name || "Anonymous"}
                  </p>
                  {user.username && (
                    <p className="text-white/40 text-sm">@{user.username}</p>
                  )}
                  {user.topTag && (
                    <span
                      className={`mt-2 text-xs px-2.5 py-1 rounded-lg border ${getTagColor(user.topTag)}`}
                    >
                      {user.topTag}
                    </span>
                  )}
                  <div className="flex items-center gap-1 mt-3 text-white/50 text-sm">
                    <MessageSquareText size={14} />
                    <span>
                      {user.questionCount}{" "}
                      {user.questionCount === 1 ? "question" : "questions"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — popular tags sidebar */}
        <div className="w-64 shrink-0 hidden lg:block">
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
            <h2 className="text-lg font-semibold text-white mb-4">Top Tech</h2>
            {popularTags.length === 0 ? (
              <p className="text-white/40 text-sm">No tags yet.</p>
            ) : (
              <div className="space-y-2">
                {popularTags.map((tag) => (
                  <Link
                    key={tag.name}
                    href={`/tags/${tag.name}`}
                    className="flex items-center justify-between group hover:bg-white/5 rounded-xl px-2 py-1.5 transition"
                  >
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${getTagColor(tag.name)}`}
                    >
                      {tag.name}
                    </span>
                    <span className="text-white/40 text-xs group-hover:text-white/60 transition">
                      {tag.count}{" "}
                      {tag.count === 1 ? "question" : "questions"}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}