"use client";

import { useRouter, useSearchParams } from "next/navigation";

const filters = [
  { name: "Newest", value: "newest" },
  { name: "Popular", value: "popular" },
  { name: "Unanswered", value: "unanswered" },
  { name: "Recommended", value: "recommended" },
  { name: "Oldest", value: "oldest" },
  
];

const HomeFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeFilter = searchParams.get("filter");

  const handleFilterClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (activeFilter === value) {
      params.delete("filter");
    } else {
      params.set("filter", value);
    }

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="mt-10 flex flex-wrap gap-3">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;

        return (
          <button
            key={filter.value}
            onClick={() => handleFilterClick(filter.value)}
            className={`rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200
              
              ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "bg-[#1e1e2f] text-gray-300 hover:bg-[#2a2a40]"
              }
            `}
          >
            {filter.name}
          </button>
        );
      })}
    </div>
  );
};

export default HomeFilters;