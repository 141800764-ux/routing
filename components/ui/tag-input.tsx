"use client";

import { useState } from "react";

type Props = {
  tags: string[];
  setTags: (tags: string[]) => void;
};

export default function TagInput({ tags, setTags }: Props) {
  const [input, setInput] = useState("");

  const addTag = (value: string) => {
    const clean = value.trim().toLowerCase();

    if (!clean) return;
    if (tags.includes(clean)) return;

    setTags([...tags, clean]);
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col gap-3">

      {/* INPUT */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a tag and press Enter..."
        className="w-full rounded-lg border border-white/10 bg-[#0b1220] p-3 text-white outline-none"
      />

      {/* TAGS */}
      <div className="flex flex-wrap gap-2">

        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white"
          >
            <span>#{tag}</span>

            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-white/60 hover:text-red-400"
            >
              ×
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}