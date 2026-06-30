import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/database/user.model";

function createSlug(title: string) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
  return `${base}-${Date.now()}`;
}

async function adjustReputation(email: string, points: number) {
  await dbConnect();
  console.log("adjustReputation called with email:", email, "points:", points);
  const result = await User.findOneAndUpdate(
    { email },
    { $inc: { reputation: points } },
    { new: true }
  );
  console.log("reputation after update:", result?.reputation);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 3;
  const query = searchParams.get("query") || "";
  const filter = searchParams.get("filter") || "newest";
  const skip = (page - 1) * pageSize;

  const where: any = query
    ? {
        OR: [
          { title: { contains: query } },
          { content: { contains: query } },
        ],
      }
    : {};

  let orderBy: any = { createdAt: "desc" };
  if (filter === "popular") orderBy = { views: "desc" };
  if (filter === "oldest") orderBy = { createdAt: "asc" };
  if (filter === "unanswered") {
    where.answers = { none: {} };
  }

  const questions = await prisma.question.findMany({
    where,
    orderBy,
    skip,
    take: pageSize,
    include: {
      tags: { include: { tag: true } },
      user: true,
      _count: { select: { answers: true } },
    },
  });

  const totalQuestions = await prisma.question.count({ where });
  const totalPages = Math.ceil(totalQuestions / pageSize);

  return NextResponse.json({
    questions,
    totalQuestions,
    totalPages,
    currentPage: page,
  });
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, tags } = body;

    if (!title || !content || !tags?.length) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const slug = createSlug(title);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const question = await prisma.question.create({
      data: {
        title,
        content,
        slug,
        userId: user.id,
        views: 0,
        likes: 0,
      },
    });

    for (const tagName of tags) {
      const tag = await prisma.tag.upsert({
        where: { slug: tagName },
        update: {},
        create: { name: tagName, slug: tagName },
      });

      await prisma.questionTag.create({
        data: { questionId: question.id, tagId: tag.id },
      });
    }

    // +5 reputation for asking a question
    // +5 reputation for asking a question
console.log("SESSION EMAIL:", session.user.email);
console.log("MONGO EMAIL:", "riyaadismail66@gmail.com");
await adjustReputation(session.user.email, 5);

    return NextResponse.json(question);
  } catch (error) {
    console.error("POST /api/questions ERROR:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown server error" },
      { status: 500 }
    );
  }
}