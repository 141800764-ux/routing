"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Link as LinkIcon,
  MapPin,
  Calendar,
  Award,
  Medal,
  Trophy,
  Eye,
  Pencil,
} from "lucide-react";
import EditProfileModal from "@/components/profile/EditProfileModal";

type TopPost = {
  id: string;
  title: string;
  views: number;
  likes: number;
  answerCount: number;
  createdAt: string;
  tags: string[];
};

type TopAnswer = {
  id: string;
  questionId: string;
  questionTitle: string;
  content: string;
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
  topAnswers: TopAnswer[];
  topTags: { name: string; count: number }[];
};

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "answers">("posts");

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

  const { user, stats, topPosts, topAnswers, topTags } = data;

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const isOwner = session?.user?.email === user.email;

  return (
    <div className="p-6 max-w-6xl mx-auto text-white space-y-8">

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

          {isOwner && (
            <button
              onClick={() => setShowEdit(true)}
              className="flex items-center gap-1 mt-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition"
            >
              <Pencil size={13} />
              Edit Profile
            </button>
          )}

          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/50">
            {user.portfolio && (
  <a href={user.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-orange-400 hover:underline">
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

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT: TABS + POSTS/ANSWERS */}
        <div className="lg:col-span-2">

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === "posts"
                  ? "bg-orange-500 text-white"
                  : "bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              Top Posts
            </button>
            <button
              onClick={() => setActiveTab("answers")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === "answers"
                  ? "bg-orange-500 text-white"
                  : "bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              Answers
            </button>
          </div>

          {activeTab === "posts" ? (
            topPosts.length === 0 ? (
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
                      <span>▲ {post.likes} votes</span>
                      <span>{post.answerCount} answers</span>
                      <span className="flex items-center gap-1">
                        <Eye size={12} />
                        {post.views} views
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )
          ) : (
            topAnswers.length === 0 ? (
              <p className="text-white/40">No answers posted yet.</p>
            ) : (
              <div className="space-y-3">
                {topAnswers.map((answer) => (
                  <Link
                    key={answer.id}
                    href={`/question/${answer.questionId}`}
                    className="block rounded-2xl border border-white/10 bg-[#111827] p-4 hover:border-orange-500/40 transition"
                  >
                    <p className="text-white/40 text-xs mb-1">Answered:</p>
                    <h3 className="font-semibold text-white hover:text-orange-400 transition">
                      {answer.questionTitle}
                    </h3>

                    <div
                      className="text-white/60 text-sm mt-2 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: answer.content }}
                    />

                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {answer.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-orange-500/10 text-orange-400 px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            )
          )}
        </div>

        {/* RIGHT: TOP TECH */}
        <div>
          <h2 className="text-xl font-bold mb-4">Top Tech</h2>

          {topTags.length === 0 ? (
            <p className="text-white/40 text-sm">No tags used yet.</p>
          ) : (
            <div className="space-y-2">
              {topTags.map((tag) => (
                <Link
                  key={tag.name}
                  href={`/tags/${tag.name}`}
                  className="flex items-center justify-between rounded-xl bg-white/[0.03] hover:bg-white/[0.07] px-4 py-3 transition"
                >
                  <span className="text-sm text-white/80">#{tag.name}</span>
                  <span className="text-xs text-white/40">{tag.count}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* EDIT PROFILE MODAL */}
      {showEdit && (
        <EditProfileModal
          userId={user._id}
          currentName={user.name}
          currentUsername={user.username}
          currentEmail={user.email}
          currentBio={user.bio}
          currentImage={user.image}
          onClose={() => setShowEdit(false)}
          onSaved={(updated) => {
            setData((prev) =>
              prev ? { ...prev, user: { ...prev.user, ...updated } } : prev
            );
          }}
        />
      )}
    </div>
  );
}