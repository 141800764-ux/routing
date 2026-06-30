"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import QuestionEditor from "@/components/editor/QuestionEditor";

const createSlug = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

const QuestionForm = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tags = tagInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    if (!title || !content || tags.length === 0) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const slug = createSlug(title);

      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          tags,
          slug,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create question";

        try {
          const errorData = await response.json();
          errorMessage = errorData?.error || errorMessage;
        } catch {
          console.log("No JSON response from server");
        }

        throw new Error(errorMessage);
      }

      
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to create question");
    } finally {
      setLoading(false);
    }
  };

  const insertCodeBlock = () => {
    setContent(
      (prev) => prev + "\n```javascript\n// code here\n```\n"
    );
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Question title..."
        className="w-full rounded-lg border border-white/10 bg-[#0b1220] p-3 text-white"
      />

      <input
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        placeholder="react, nextjs, redux"
        className="w-full rounded-lg border border-white/10 bg-[#0b1220] p-3 text-white"
      />

      <Button
        type="button"
        onClick={insertCodeBlock}
        className="w-fit bg-gray-800 text-white"
      >
        + Insert Code Block
      </Button>

      <QuestionEditor content={content} setContent={setContent} />

      <Button
        type="submit"
        disabled={loading}
        className="bg-orange-500 text-white"
      >
        {loading ? "Posting..." : "Post Question"}
      </Button>
    </form>
  );
};

export default QuestionForm;