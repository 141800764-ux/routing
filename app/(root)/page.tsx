import RightSideBar from "@/components/navigation/navbar/RightSideBar";
import { prisma } from "@/lib/prisma";
import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/filters/Filter";
import { CollectionFilters } from "@/constants/filters";
import { headers } from "next/headers";

// Add near the search input:
<Filter filters={CollectionFilters} />

const Home = async () => {
  const pageHeader = headers().get("x-page");
const page = Number(pageHeader) || 1;
const pageSize = 3;
const skip = (page - 1) * pageSize;

const questions = await prisma.question.findMany({
  orderBy: { createdAt: "desc" },
  skip,
  take: pageSize,
  include: {
    user: true,
    tags: { include: { tag: true } },
  },
});

  return (
    <div className="flex w-full">

      {/* MAIN CONTENT */}
      <main className="flex-1 text-white p-6 lg:pr-72">

        <h1 className="text-3xl md:text-5xl font-bold">
          All Questions
        </h1>

        <p className="mt-2 text-white/50 text-sm">
          {questions.length} question{questions.length !== 1 ? "s" : ""}
        </p>

        {/* QUESTION LIST */}
        <div className="mt-6 flex flex-col gap-4">
          {questions.length === 0 ? (
            <p className="text-white/40">No questions yet.</p>
          ) : (
            questions.map((q) => (
              <QuestionCard
                key={q.id}
                id={q.id}
                title={q.title}
                description={q.content}
                tag={q.tags[0]?.tag?.name || "general"}
                author={q.user?.name || "Anonymous"}
                createdAt={q.createdAt.toISOString()}
                views={q.views}
              />
            ))
          )}
        </div>

      </main>

      {/* RIGHT SIDEBAR */}
      <RightSideBar />

    </div>
  );
};

export default Home;