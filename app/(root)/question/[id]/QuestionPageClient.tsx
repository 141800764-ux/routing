"use client";

import { useEffect, useState, use } from "react";
import { Eye, MessageSquare, Send, Sparkles } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import Votes from "@/components/votes/votes";

type Vote = {
  voteType: string;
  userId: string;
};

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: { name?: string; image?: string };
};

type Answer = {
  id: string;
  content: string;
  createdAt: string;
  user: { name?: string; image?: string };
  comments: Comment[];
  votes: Vote[];
};

type Question = {
  id: string;
  title: string;
  content: string;
  views: number;
  createdAt: string;
  user: { name?: string; image?: string; id?: string };
  tags: { tag: { name: string } }[];
  answers: Answer[];
  votes: Vote[];
};

export default function QuestionPageClient({
  id,
}: {
  id: string;
}) {
  const { data: session } = useSession();

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  const [answerContent, setAnswerContent] = useState("");
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  const [commentContent, setCommentContent] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<string | null>(null);
  const [showCommentBox, setShowCommentBox] = useState<string | null>(null);

  const currentUserId = (session?.user as any)?.id;

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await fetch(`/api/questions/${id}`);
        const data = await res.json();
        if (res.ok) setQuestion(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const generateAIAnswer = async () => {
    if (!question) return;
    setGeneratingAI(true);

    try {
      const res = await fetch("/api/ai-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: question.title,
          content: question.content,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setAnswerContent(data.answer);
      } else {
        alert(data.error || "Failed to generate answer");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate AI answer");
    } finally {
      setGeneratingAI(false);
    }
  };

  const submitAnswer = async () => {
    if (!answerContent.trim()) return;
    setSubmittingAnswer(true);

    const res = await fetch("/api/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: id, content: answerContent }),
    });

    const newAnswer = await res.json();

    if (res.ok) {
      setQuestion((prev) =>
        prev
          ? { ...prev, answers: [...prev.answers, { ...newAnswer, votes: [] }] }
          : prev
      );
      setAnswerContent("");
    }

    setSubmittingAnswer(false);
  };

  const submitComment = async (answerId: string) => {
    const content = commentContent[answerId];
    if (!content?.trim()) return;
    setSubmittingComment(answerId);

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answerId, content }),
    });

    const newComment = await res.json();

    if (res.ok) {
      setQuestion((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          answers: prev.answers.map((a) =>
            a.id === answerId
              ? { ...a, comments: [...a.comments, newComment] }
              : a
          ),
        };
      });
      setCommentContent((prev) => ({ ...prev, [answerId]: "" }));
      setShowCommentBox(null);
    }

    setSubmittingComment(null);
  };

  const timeAgo = (date: string) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (diff < 1) return "just now";
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (loading) return <div className="p-10 text-white">Loading...</div>;
  if (!question) return <div className="p-10 text-red-500">Question not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto text-white space-y-8">

      {/* QUESTION */}
      <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold">{question.title}</h1>

          <Votes
            targetId={question.id}
            targetType="question"
            upvotes={(question.votes ?? []).filter((v) => v.voteType === "up").length}
            downvotes={(question.votes ?? []).filter((v) => v.voteType === "down").length}
            hasupVoted={(question.votes ?? []).some(
              (v) => v.userId === currentUserId && v.voteType === "up"
            )}
            hasdownVoted={(question.votes ?? []).some(
              (v) => v.userId === currentUserId && v.voteType === "down"
            )}
          />
        </div>

        <div className="flex items-center gap-4 mt-2 text-white/40 text-sm">
          <span className="flex items-center gap-1">
            <Eye size={14} />
            {question.views} views
          </span>
          <span>Asked {timeAgo(question.createdAt)}</span>
          <span>by {question.user?.name || "Anonymous"}</span>
        </div>

        <div
          className="mt-6 text-white/80 prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: question.content }}
        />

        <div className="mt-4 flex gap-2 flex-wrap">
          {question.tags.map((t) => (
            <span
              key={t.tag.name}
              className="text-xs bg-orange-500/10 text-orange-400 px-2 py-1 rounded-full"
            >
              #{t.tag.name}
            </span>
          ))}
        </div>
      </div>

      {/* ANSWERS */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          {question.answers.length} Answer{question.answers.length !== 1 ? "s" : ""}
        </h2>

        <div className="space-y-6">
          {question.answers.map((answer) => (
            <div
              key={answer.id}
              className="rounded-2xl border border-white/10 bg-[#111827] p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  {answer.user?.image && (
                    <Image
                      src={answer.user.image}
                      alt={answer.user.name || "User"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-sm font-semibold">
                      {answer.user?.name || "Anonymous"}
                    </p>
                    <p className="text-xs text-white/40">
                      {timeAgo(answer.createdAt)}
                    </p>
                  </div>
                </div>

                <Votes
                  targetId={answer.id}
                  targetType="answer"
                  upvotes={(answer.votes ?? []).filter((v) => v.voteType === "up").length}
                  downvotes={(answer.votes ?? []).filter((v) => v.voteType === "down").length}
                  hasupVoted={(answer.votes ?? []).some(
                    (v) => v.userId === currentUserId && v.voteType === "up"
                  )}
                  hasdownVoted={(answer.votes ?? []).some(
                    (v) => v.userId === currentUserId && v.voteType === "down"
                  )}
                />
              </div>

              <div
                className="text-white/80 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: answer.content }}
              />

              {answer.comments.length > 0 && (
                <div className="mt-4 border-t border-white/5 pt-4 space-y-3">
                  {answer.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2 text-sm">
                      {comment.user?.image && (
                        <Image
                          src={comment.user.image}
                          alt={comment.user.name || "User"}
                          width={24}
                          height={24}
                          className="rounded-full mt-0.5 flex-shrink-0"
                        />
                      )}
                      <div>
                        <span className="font-semibold text-white/70 mr-2">
                          {comment.user?.name || "Anonymous"}
                        </span>
                        <span className="text-white/50">{comment.content}</span>
                        <span className="text-white/30 text-xs ml-2">
                          {timeAgo(comment.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3">
                {showCommentBox === answer.id ? (
                  <div className="flex gap-2 mt-2">
                    <input
                      value={commentContent[answer.id] || ""}
                      onChange={(e) =>
                        setCommentContent((prev) => ({
                          ...prev,
                          [answer.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submitComment(answer.id);
                      }}
                      placeholder="Add a comment..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-orange-500/50"
                    />
                    <button
                      onClick={() => submitComment(answer.id)}
                      disabled={submittingComment === answer.id}
                      className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-semibold disabled:opacity-50"
                    >
                      <Send size={14} />
                    </button>
                    <button
                      onClick={() => setShowCommentBox(null)}
                      className="px-3 py-1.5 text-white/40 hover:text-white text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : session ? (
                  <button
                    onClick={() => setShowCommentBox(answer.id)}
                    className="text-xs text-white/30 hover:text-orange-400 flex items-center gap-1 mt-2 transition"
                  >
                    <MessageSquare size={12} />
                    Add comment
                  </button>
                ) : (
                  <button
                    onClick={() => signIn()}
                    className="text-xs text-white/30 hover:text-orange-400 mt-2 transition"
                  >
                    Login to comment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POST ANSWER */}
      <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your Answer</h2>

          {session && (
            <button
              onClick={generateAIAnswer}
              disabled={generatingAI}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl text-sm font-semibold disabled:opacity-50 transition"
            >
              <Sparkles size={15} />
              {generatingAI ? "Generating..." : "Generate AI Answer"}
            </button>
          )}
        </div>

        {session ? (
          <>
            <textarea
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder={
                generatingAI
                  ? "Generating AI answer..."
                  : "Write your answer here, or generate one with AI above..."
              }
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500/50 resize-none"
            />
            <button
              onClick={submitAnswer}
              disabled={submittingAnswer || !answerContent.trim()}
              className="mt-3 px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-xl font-semibold text-sm disabled:opacity-50 transition"
            >
              {submittingAnswer ? "Posting..." : "Post Answer"}
            </button>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-white/50 mb-3">
              You must be logged in to post an answer
            </p>
            <button
              onClick={() => signIn()}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-xl font-semibold text-sm transition"
            >
              Login to Answer
            </button>
          </div>
        )}
      </div>

    </div>
  );
}