"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function TagPage() {
  const params = useParams();

  const tag = Array.isArray(params.tag)
    ? params.tag[0]
    : params.tag;

  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/questions", {
        cache: "no-store",
      });

      const result = await res.json();

      const allQuestions = result.questions || [];

      const filtered = allQuestions.filter((q: any) =>
        q.tags?.some(
          (t: any) =>
            t.tag?.name?.toLowerCase() === tag.toLowerCase()
        )
      );

      setQuestions(filtered);
    };

    load();
  }, [tag]);

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-bold mb-6">
        #{tag}
      </h1>

      {questions.length === 0 ? (
        <p>No questions found for this tag</p>
      ) : (
        questions.map((q) => (
          <div
            key={q.id || q._id}
            className="mb-4 border p-4 rounded"
          >
            <h2 className="text-xl font-bold">
              {q.title}
            </h2>
          </div>
        ))
      )}
    </div>
  );
}