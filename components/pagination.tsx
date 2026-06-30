"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number | string | undefined;
  isNext: boolean;
  containerClasses?: string;
}

export default function Pagination({
  page = 1,
  isNext,
  containerClasses = "",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(page);

  const navigate = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (currentPage === 1 && !isNext) return null;

  return (
    <div className={`flex w-full items-center justify-center gap-3 ${containerClasses}`}>
      {currentPage > 1 && (
        <button
          onClick={() => navigate(currentPage - 1)}
          className="flex items-center gap-1 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-sm hover:bg-white/10 transition"
        >
          <ChevronLeft size={16} />
          Prev
        </button>
      )}

      <span className="px-4 py-2 rounded-xl bg-orange-500/10 text-orange-400 text-sm font-semibold">
        {currentPage}
      </span>

      {isNext && (
        <button
          onClick={() => navigate(currentPage + 1)}
          className="flex items-center gap-1 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-sm hover:bg-white/10 transition"
        >
          Next
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}