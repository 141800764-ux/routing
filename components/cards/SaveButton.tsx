"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { useSession, signIn } from "next-auth/react";

interface Props {
  questionId: string;
  questionTitle?: string;
  initialSaved?: boolean;
}

export default function SaveButton({
  questionId,
  questionTitle = "",
  initialSaved = false,
}: Props) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      signIn();
      return;
    }

    if (loading) return;
    setLoading(true);

    const prev = saved;
    setSaved(!saved);

    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, questionTitle }),
      });

      const data = await res.json();

      if (!data.success) {
        setSaved(prev);
      } else {
        setSaved(data.saved);
      }
    } catch {
      setSaved(prev);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`transition-colors disabled:opacity-50 ${
        saved ? "text-orange-500" : "text-white/40 hover:text-orange-400"
      }`}
      title={saved ? "Remove from saved" : "Save question"}
    >
      <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}