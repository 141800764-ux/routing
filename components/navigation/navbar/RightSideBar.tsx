"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Menu } from "lucide-react";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

const topQuestions = [
  {
    title: "How to create a custom hook in React?",
    slug: "custom-hook-react",
  },
  {
    title: "How to use React Query?",
    slug: "react-query",
  },
  {
    title: "How to use Redux?",
    slug: "redux",
  },
  {
    title: "How to use React Router?",
    slug: "react-router",
  },
  {
    title: "How to use React Context?",
    slug: "react-context",
  },
];

const tags = [
  {
    name: "REACT",
    count: 100,
    icon: "devicon-react-original colored",
    slug: "react",
  },
  {
    name: "JAVASCRIPT",
    count: 200,
    icon: "devicon-javascript-plain colored",
    slug: "javascript",
  },
  {
    name: "TYPESCRIPT",
    count: 150,
    icon: "devicon-typescript-plain colored",
    slug: "typescript",
  },
  {
    name: "NEXTJS",
    count: 50,
    icon: "devicon-nextjs-plain",
    slug: "nextjs",
  },
  {
    name: "REACT-QUERY",
    count: 75,
    icon: "devicon-react-original colored",
    slug: "react-query",
  },
];

function SidebarContent({
  activeTag,
  setActiveTag,
}: {
  activeTag: string | null;
  setActiveTag: (tag: string | null) => void;
}) {
  return (
    <div className="flex flex-col gap-10">

      {/* ================= TOP QUESTIONS ================= */}
      <div>
        <h2 className="text-xl font-bold text-white">
          Top Questions
        </h2>

        <div className="mt-7 flex flex-col gap-6">
          {topQuestions.map((q, index) => (
            <Link
              key={index}
              href={`/questions/${q.slug}`}
              className="
                flex items-start justify-between gap-4
                text-white/80 hover:text-white
                transition
              "
            >
              <span className="text-sm leading-6">
                {q.title}
              </span>

              <ChevronRight
                size={18}
                className="mt-1 shrink-0 text-orange-500"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* ================= POPULAR TAGS ================= */}
      <div>
        <h2 className="text-xl font-bold text-white">
          Popular Tags
        </h2>

        <div className="mt-7 flex flex-col gap-4">
          {tags.map((tag, index) => (
            <button
              key={index}
              onClick={() =>
                setActiveTag(
                  activeTag === tag.slug ? null : tag.slug
                )
              }
              className="
                flex items-center justify-between
                rounded-xl
                bg-white/[0.03]
                px-4 py-3
                transition hover:bg-white/[0.07]
              "
            >
              <div className="flex items-center gap-3">
                <i className={`${tag.icon} text-lg`} />

                <span className="text-sm text-white/80">
                  {tag.name}
                </span>
              </div>

              <span className="text-xs text-white/40">
                {tag.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RightSidebar() {
  const [activeTag, setActiveTag] =
    useState<string | null>(null);

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <aside
        className="
          hidden xl:flex
          fixed right-0 top-20
          h-[calc(100vh-5rem)]
          w-[350px]
          flex-col
          overflow-y-auto
          border-l border-white/10
          bg-[#060B1A]
          px-6 pt-10
          z-40
        "
      >
        <SidebarContent
          activeTag={activeTag}
          setActiveTag={setActiveTag}
        />
      </aside>

      {/* ================= MOBILE ================= */}
      <div className="xl:hidden fixed right-4 top-24 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="
                rounded-lg
                border border-white/10
                bg-[#111827]
                p-2
                text-white
              "
            >
              <Menu size={22} />
            </button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="
              w-[300px]
              border-l border-white/10
              bg-[#060B1A]
              text-white
            "
          >
            <SheetTitle className="mb-6 text-white">
              Menu
            </SheetTitle>

            <SidebarContent
              activeTag={activeTag}
              setActiveTag={setActiveTag}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}