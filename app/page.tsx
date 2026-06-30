"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import HomeFilters from "@/components/filters/homefilter";
import QuestionCard from "@/components/cards/QuestionCard";
import { Button } from "@/components/ui/button";

type Question = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  views: number;

  user?: {
    name?: string;
    email?: string;
  };

  tags?: {
    tag: {
      name: string;
    };
  }[];

  _count?: {
    answers: number;
  };
};


export default function Home() {
  const [posts, setPosts] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();
  const router = useRouter();

  const filter = searchParams.get("filter") || "newest";
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    console.log("TOTAL PAGES:", totalPages);
    const fetchQuestions = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `/api/questions?page=${page}&pageSize=10&filter=${filter}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        setPosts(data.questions || []);
        setTotalPages(Number(data.totalPages ?? 1));
      } catch (err) {
        console.error("Failed to load questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [filter, page]);

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(newPage));

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-white">
          All Questions
        </h1>
      </div>

      {/* FILTERS */}
      <HomeFilters />

      {/* QUESTIONS */}
      <div className="space-y-5">
        {loading ? (
          <p className="text-white">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-white">No questions found.</p>
        ) : (
          posts.map((q) => (
            <QuestionCard
              key={q.id}
              id={q.id}
              title={q.title}
              tag={q.tags?.[0]?.tag?.name || "general"}
              description={q.content}
              author={q.user?.name || q.user?.email || "Anonymous"}
              authorEmail={q.user?.email}
              createdAt={q.createdAt}
              views={q.views ?? 0}
              answerCount={q._count?.answers ?? 0}
            />
          ))
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">

          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
            .map((pageNumber) => (
              <Button
                key={pageNumber}
                variant={pageNumber === page ? "default" : "outline"}
                className={
                  pageNumber === page ? "bg-orange-500 text-white" : ""
                }
                onClick={() => goToPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            ))}

          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </Button>

        </div>
      )}

    </div>
  );
}