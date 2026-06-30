"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Link as LinkIcon,
  MapPin,
  Calendar,
  Award,
  Medal,
  Trophy,
  Eye,
} from "lucide-react";

type TopPost = {
  id: string;
  title: string;
  views: number;
  likes: number;
  answerCount: number;
  createdAt: string;
  tags: string[];
};

type ProfileData = {
  user: {
    _id: string;
    name: string;
    username: string;
    email: string;
    bio: string;
    image: string;
    location: string;
    portfolio: string;
    reputation: number;
    createdAt: string;
  };
  stats: {
    totalQuestions: number;
    totalAnswers: number;
    badges: { GOLD: number; SILVER: number; BRONZE: number };
  };
  topPosts: TopPost[];
};

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile/${id}`);
        const json = await res.json();
        if (json.success) setData(json);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-white">Loading profile...</div>;
  }

  if (!data) {
    return <div className="p-10 text-red-500">User not found</div>;
  }

  const { user, stats, topPosts } = data;

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-6 max-w-5xl mx-auto text-white space-y-8">

      {/* PROFILE HEADER */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <Image
          src={user.image || "/avatar.png"}
          alt={user.name}
          width={120}
          height={120}
          className="rounded-full border-4 border-orange-500/30"
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-white/40">@{user.username}</p>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/50">
            {user.portfolio && (
              <a
                href={user.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-orange-400 hover:underline"
              >
                <LinkIcon size={14} />
                {user.portfolio.replace(/^https?:\/\//, "")}
              </a>
            )}

            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {user.location}
              </span>
            )}

            <span className="flex items-center gap-1">
              <Calendar size={14} />
              Joined {joinedDate}
            </span>
          </div>

          {user.bio && (
            <p className="text-white/70 mt-4 max-w-2xl">{user.bio}</p>
          )}
        </div>
      </div>

      {/* STATS */}
      <div>
        <h2 className="text-xl font-bold mb-4">Stats</h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-4">
            <p className="text-2xl font-bold">{stats.totalQuestions}</p>
            <p className="text-white/40 text-sm">Questions</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-4">
            <p className="text-2xl font-bold">{stats.totalAnswers}</p>
            <p className="text-white/40 text-sm">Answers</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-4 flex flex-col items-center justify-center text-center">
            <Trophy size={20} className="text-yellow-400 mb-1" />
            <p className="text-lg font-bold">{stats.badges.GOLD}</p>
            <p className="text-white/40 text-xs">Gold Badges</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-4 flex flex-col items-center justify-center text-center">
            <Medal size={20} className="text-gray-300 mb-1" />
            <p className="text-lg font-bold">{stats.badges.SILVER}</p>
            <p className="text-white/40 text-xs">Silver Badges</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-4 flex flex-col items-center justify-center text-center">
            <Award size={20} className="text-orange-700 mb-1" />
            <p className="text-lg font-bold">{stats.badges.BRONZE}</p>
            <p className="text-white/40 text-xs">Bronze Badges</p>
          </div>
        </div>

        <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-orange-500/10 px-4 py-2 text-orange-400 text-sm font-semibold">
          {user.reputation} reputation
        </div>
      </div>

      {/* TOP POSTS */}
      <div>
        <h2 className="text-xl font-bold mb-4">Top Posts</h2>

        {topPosts.length === 0 ? (
          <p className="text-white/40">No questions posted yet.</p>
        ) : (
          <div className="space-y-3">
            {topPosts.map((post) => (
              <Link
                key={post.id}
                href={`/question/${post.id}`}
                className="block rounded-2xl border border-white/10 bg-[#111827] p-4 hover:border-orange-500/40 transition"
              >
                <h3 className="font-semibold text-white hover:text-orange-400 transition">
                  {post.title}
                </h3>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-orange-500/10 text-orange-400 px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-3 text-white/40 text-xs">
                  <span>â–² {post.likes} votes</span>
                  <span>{post.answerCount} answers</span>
                  <span className="flex items-center gap-1">
                    <Eye size={12} />
                    {post.views} views
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

