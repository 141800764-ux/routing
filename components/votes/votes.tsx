"use client";

import React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useSession, signIn } from "next-auth/react";

interface Props {
  targetId: string;
  targetType: "question" | "answer";
  upvotes: number;
  downvotes: number;
  hasupVoted: boolean;
  hasdownVoted: boolean;
}

const Votes = ({
  targetId,
  targetType,
  upvotes: initialUpvotes,
  downvotes: initialDownvotes,
  hasupVoted,
  hasdownVoted,
}: Props) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = React.useState(false);

  const [upvotes, setUpvotes] = React.useState(initialUpvotes);
  const [downvotes, setDownvotes] = React.useState(initialDownvotes);
  const [userVote, setUserVote] = React.useState<"up" | "down" | null>(
    hasupVoted ? "up" : hasdownVoted ? "down" : null
  );

  const handleVote = async (voteType: "up" | "down") => {
    if (!session) {
      signIn();
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    const prev = { upvotes, downvotes, userVote };

    if (userVote === voteType) {
      setUserVote(null);
      if (voteType === "up") setUpvotes((v) => v - 1);
      else setDownvotes((v) => v - 1);
    } else {
      if (userVote === "up") setUpvotes((v) => v - 1);
      if (userVote === "down") setDownvotes((v) => v - 1);
      setUserVote(voteType);
      if (voteType === "up") setUpvotes((v) => v + 1);
      else setDownvotes((v) => v + 1);
    }

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId, targetType, voteType }),
      });

      if (!res.ok) {
        setUpvotes(prev.upvotes);
        setDownvotes(prev.downvotes);
        setUserVote(prev.userVote);
      }
    } catch (error) {
      console.error(error);
      setUpvotes(prev.upvotes);
      setDownvotes(prev.downvotes);
      setUserVote(prev.userVote);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => handleVote("up")}
        disabled={isLoading}
        className={`flex items-center gap-1.5 transition-colors disabled:opacity-50 ${
          userVote === "up"
            ? "text-orange-500"
            : "text-white/40 hover:text-orange-400"
        }`}
      >
        <ThumbsUp
          size={18}
          fill={userVote === "up" ? "currentColor" : "none"}
        />
        <span className="text-sm font-medium">{upvotes}</span>
      </button>

      <button
        onClick={() => handleVote("down")}
        disabled={isLoading}
        className={`flex items-center gap-1.5 transition-colors disabled:opacity-50 ${
          userVote === "down"
            ? "text-red-500"
            : "text-white/40 hover:text-red-400"
        }`}
      >
        <ThumbsDown
          size={18}
          fill={userVote === "down" ? "currentColor" : "none"}
        />
        <span className="text-sm font-medium">{downvotes}</span>
      </button>
    </div>
  );
};

export default Votes;