"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import QuestionEditor from "@/components/editor/QuestionEditor";

export default function EditQuestionPage() {
  const router = useRouter();
  const params = useParams();

  const id = params?.id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const res = await fetch(`/api/questions/${id}`);

        if (!res.ok) {
          console.error("Failed to load question");
          return;
        }

        const question = await res.json();

        setTitle(question.title || "");
        setContent(question.content || "");
        setTags(
          question.tags?.map((t: any) => t.tag.name).join(", ") || ""
        );
      } catch (err) {
        console.error("Error loading question:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadQuestion();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    const tagArray = tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    if (tagArray.length === 0) {
      setError("At least one tag is required.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          tags: tagArray,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update question");
        setSaving(false);
        return;
      }

      router.push(`/question/${id}`);
      router.refresh();
    } catch (err) {
      console.error("Update error:", err);
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading question...
      </div>
    );
  }

  return (
    <form onSubmit={handleUpdate} className="max-w-3xl mx-auto p-6 text-white space-y-5">
      <h1 className="text-2xl font-bold mb-2">Edit Question</h1>

      <div>
        <label className="text-sm text-white/50 mb-1 block">Title</label>
        <input
          className="w-full rounded-lg border border-white/10 bg-[#0b1220] p-3 text-white outline-none focus:border-orange-500/50"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Question title..."
        />
      </div>

      <div>
        <label className="text-sm text-white/50 mb-1 block">Content</label>
        <QuestionEditor content={content} setContent={setContent} />
      </div>

      <div>
        <label className="text-sm text-white/50 mb-1 block">
          Tags (comma separated)
        </label>
        <input
          className="w-full rounded-lg border border-white/10 bg-[#0b1220] p-3 text-white outline-none focus:border-orange-500/50"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="react, nextjs, redux"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-orange-500 hover:bg-orange-600 px-6 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 transition"
      >
        {saving ? "Updating..." : "Update Question"}
      </button>
    </form>
  );
}