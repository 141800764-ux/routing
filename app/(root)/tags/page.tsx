import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: { questions: true },
      },
    },
    orderBy: {
      questions: {
        _count: "desc",
      },
    },
  });

  return (
    <div className="p-6 text-white">
      <h1 className="text-4xl font-bold mb-6">Tags</h1>

      {tags.length === 0 ? (
        <p className="text-white/40">No tags yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.slug}`}
              className="rounded-2xl border border-white/10 bg-[#111827] p-6 hover:border-orange-500/40 transition"
            >
              <h2 className="text-lg font-bold mb-2">#{tag.name}</h2>

              <p className="text-white/40 text-sm mb-4">
                {tag.description || "No description available"}
              </p>

              <div className="text-orange-500 font-semibold text-sm">
                {tag._count.questions} {tag._count.questions === 1 ? "Question" : "Questions"}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}