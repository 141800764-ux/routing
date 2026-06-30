"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();

  const slug = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug;

  const [question, setQuestion] = useState<any>(null);

  useEffect(() => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then(async (result) => {
        const questions = result.questions || [];

        const found = questions.find(
          (q: any) => q.slug === slug
        );

        if (found) {
          const viewedKey = `question-viewed-${found.id}`;

          if (!localStorage.getItem(viewedKey)) {
            try {
              await fetch(
                `/api/questions/${found.id}/views`,
                {
                  method: "PATCH",
                }
              );

              localStorage.setItem(
                viewedKey,
                "true"
              );

              found.views =
                (found.views || 0) + 1;
            } catch (error) {
              console.error(error);
            }
          }

          setQuestion(found);
        }
      });
  }, [slug]);

  if (!question) {
    return (
      <div className="p-10 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-10 text-white">
      <h1 className="text-4xl font-bold mb-4">
        {question.title}
      </h1>

      <div className="flex flex-wrap gap-6 text-sm text-white/60 mb-6">
        <span>
          👁 {question.views || 0} Views
        </span>

        <span>
          👍 {question.likes || 0} Likes
        </span>

        {question.user?.name && (
          <span>
            👤 {question.user.name}
          </span>
        )}

        {question.createdAt && (
          <span>
            📅{" "}
            {new Date(
              question.createdAt
            ).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <p className="whitespace-pre-wrap leading-7">
          {question.content}
        </p>
      </div>

      {question.tags?.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {question.tags.map(
            (item: any, index: number) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-blue-600 text-sm"
              >
                #{item.tag?.name}
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
}