import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import QuestionPageClient from "./QuestionPageClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const question = await prisma.question.findUnique({
    where: { id },
  });

  if (!question) {
    return {
      title: "Question not found",
      description: "This question does not exist",
    };
  }

  const plainContent = question.content.replace(/<[^>]*>/g, "");

  return {
    title: question.title,
    description: plainContent.slice(0, 150),
    openGraph: {
      title: question.title,
      description: plainContent.slice(0, 150),
    },
    twitter: {
      card: "summary_large_image",
      title: question.title,
      description: plainContent.slice(0, 150),
    },
  };
}

export default async function QuestionPage({ params }: Props) {
  const { id } = await params;

  return <QuestionPageClient id={id} />;
}