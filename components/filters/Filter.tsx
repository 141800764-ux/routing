"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter as FilterIcon } from "lucide-react";

type FilterOption = { name: string; value: string };

interface Props {
  filters: FilterOption[];
  otherClasses?: string;
}

export default function Filter({ filters, otherClasses = "" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paramFilter = searchParams.get("filter") || "newest";

  const handleUpdateParams = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("filter", value);
    } else {
      params.delete("filter");
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className={`relative ${otherClasses}`}>
      <select
        value={paramFilter}
        onChange={(e) => handleUpdateParams(e.target.value)}
        className="
          appearance-none
          flex items-center gap-2
          bg-white/5 border border-white/10
          rounded-xl
          pl-9 pr-8 py-2.5
          text-sm text-white
          outline-none
          focus:border-orange-500/50
          cursor-pointer
        "
      >
        <option value="newest" className="bg-[#111827]">
          All
        </option>
        {filters.map((filter) => (
          <option
            key={filter.value}
            value={filter.value}
            className="bg-[#111827]"
          >
            {filter.name}
          </option>
        ))}
      </select>

      <FilterIcon
        size={16}
        className="absolute left-3 top-3 text-white/40 pointer-events-none"
      />
    </div>
  );
}