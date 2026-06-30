"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type TopTag = {
  tagId: string;
  name: string;
  slug: string;
  description?: string;
  questionCount: number;
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

export default function TopTags() {
  const [tags, setTags] = useState<TopTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tags/top")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setTags(data.tags);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Top Tags</h2>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-8 rounded-lg bg-white/5 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
      <h2 className="text-lg font-semibold text-white mb-4">Top Tags</h2>
      <div className="space-y-2">
        {tags.map((tag) => (
          <Link
            key={tag.tagId}
            href={`/tags/${tag.slug}`}
            className="flex items-center justify-between group hover:bg-white/5 rounded-xl px-2 py-1.5 transition"
          >
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${getTagColor(tag.name)}`}
            >
              {tag.name}
            </span>
            <span className="text-white/40 text-xs group-hover:text-white/60 transition">
              {tag.questionCount}{" "}
              {tag.questionCount === 1 ? "question" : "questions"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}