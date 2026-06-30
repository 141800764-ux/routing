"use client";

import { useState } from "react";
import Link from "next/link";
import { ThumbsUp, Eye, MessageSquare, Send, X, Trash2 } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import SaveButton from "@/components/cards/SaveButton";

interface Comment {
  id: string;
  content: string;
  user: { name?: string | null };
}

interface QuestionCardProps {
  id: string;
  title: string;
  tag: string;
  description?: string;
  author?: string;
  authorEmail?: string;
  createdAt?: string;
  views?: number;
  answerCount?: number;
}

const QuestionCard = ({
  id,
  title,
  tag,
  description,
  author,
  authorEmail,
  createdAt,
  views = 0,
  answerCount = 0,
}: QuestionCardProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  const [liked, setLiked] = useState(false);
  const [votes, setVotes] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = session?.user?.email === authorEmail;

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => !prev);
    setVotes((v) => (liked ? v - 1 : v + 1));
  };

  const timeAgo = (date?: string) => {
    if (!date) return "";
    const diff = Math.floor(
      (Date.now() - new Date(date).getTime()) / 60000
    );
    if (diff < 1) return "just now";
    if (diff < 60) return `${diff} minute${diff !== 1 ? "s" : ""} ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  };

  const toggleComments = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (showComments) {
      setShowComments(false);
      return;
    }

    setShowComments(true);
    setLoadingComments(true);

    try {
      const res = await fetch(`/api/questions/${id}/comments`);
      const data = await res.json();
      if (res.ok) setComments(data);
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const submitComment = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!commentText.trim() || submitting) return;

    setSubmitting(true);

    try {
      const res = await fetch(`/api/questions/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText }),
      });

      const data = await res.json();

      if (res.ok) {
        setComments((prev) => [...prev, data]);
        setCommentText("");
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteQuestion = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this question?")) return;

    setDeleting(true);

    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete question");
      }
    } catch (err) {
      console.error("Failed to delete question:", err);
      alert("Failed to delete question");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827] p-5 transition hover:border-orange-500/40">

      {/* TITLE */}
      <Link href={`/question/${id}`} className="block">
        <h2 className="text-xl font-bold text-white hover:text-orange-400 transition">
          {title}
        </h2>
      </Link>

      {/* AUTHOR + TIME */}
      <p className="text-xs text-gray-400 mt-1">
        Posted by {author || "Anonymous"} · {timeAgo(createdAt)}
      </p>

      {/* DESCRIPTION */}
      {description && (
        <div
          className="text-white/60 mt-2 text-sm line-clamp-2"
          dangerouslySetInnerHTML={{
            __html: description
              .replace(/<p><\/p>/g, "")
              .replace(/<p>\s*<\/p>/g, ""),
          }}
        />
      )}

      {/* TAG */}
      <div className="mt-4">
        <Link
          href={`/tags/${tag}`}
          className="text-orange-400 text-sm hover:underline"
        >
          #{tag}
        </Link>
      </div>

      {/* EDIT + DELETE (owner only) */}
      {isOwner && (
        <div className="flex items-center gap-3 mt-2">
          <Link href={`/edit-question/${id}`}>
            <button className="text-blue-400 text-sm hover:underline">
              Edit
            </button>
          </Link>
          <button
            onClick={deleteQuestion}
            disabled={deleting}
            className="flex items-center gap-1 text-red-400 text-sm hover:text-red-300 disabled:opacity-50 transition"
          >
            <Trash2 size={13} />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}

      {/* BOTTOM */}
<div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

  <div className="flex items-center gap-2">
    <button onClick={toggleLike}>
      <ThumbsUp
        size={18}
        className={liked ? "text-orange-500" : "text-gray-400"}
        fill={liked ? "currentColor" : "none"}
      />
    </button>
    <span className="text-white text-sm">{votes} Votes</span>
  </div>

  <div className="flex items-center gap-6 text-sm text-gray-300">
    <Link
      href={`/question/${id}`}
      className="hover:text-white transition"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="text-white font-semibold">{answerCount}</span> Answers
    </Link>

    <span className="flex items-center gap-1">
      <Eye size={15} className="text-gray-400" />
      <span className="text-white font-semibold">{views}</span> Views
    </span>

    <button
      onClick={toggleComments}
      className="flex items-center gap-1 hover:text-white transition"
    >
      <MessageSquare size={15} className="text-gray-400" />
      <span className="text-white font-semibold">
        {comments.length > 0 ? comments.length : ""}
      </span>
      {showComments ? "Hide" : "Comment"}
    </button>

    {/* SAVE BUTTON — always visible */}
    <SaveButton questionId={id} questionTitle={title} />
  </div>

</div>

      {/* COMMENTS SECTION */}
      {showComments && (
        <div
          className="mt-4 border-t border-white/5 pt-4 space-y-3"
          onClick={(e) => e.stopPropagation()}
        >
          {loadingComments ? (
            <p className="text-white/30 text-sm">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-white/30 text-sm">
              No comments yet. Be the first!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-2 text-sm">
                <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-xs flex-shrink-0">
                  {comment.user?.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <span className="font-semibold text-white/70 mr-2">
                    {comment.user?.name || "Anonymous"}
                  </span>
                  <span className="text-white/50">{comment.content}</span>
                </div>
              </div>
            ))
          )}

          {session ? (
            <div className="flex gap-2 mt-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitComment(e as any);
                }}
                placeholder="Write a comment..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-orange-500/50"
              />
              <button
                onClick={submitComment}
                disabled={submitting || !commentText.trim()}
                className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm disabled:opacity-50 transition"
              >
                <Send size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowComments(false);
                }}
                className="px-3 py-1.5 text-white/40 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                signIn();
              }}
              className="text-xs text-orange-400 hover:underline mt-1"
            >
              Login to comment
            </button>
          )}
        </div>
      )}

    </div>
  );
};

export default QuestionCard;