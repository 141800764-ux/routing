import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const question = await prisma.question.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: {
        user: true,
        tags: { include: { tag: true } },
        votes: true,
        answers: {
          orderBy: { createdAt: "asc" },
          include: {
            user: true,
            votes: true,
            comments: {
              orderBy: { createdAt: "asc" },
              include: { user: true },
            },
          },
        },
      },
    });

    return NextResponse.json(question);
  } catch (err) {
    console.error("GET question error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingQuestion = await prisma.question.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    if (existingQuestion.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { title, content, tags } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    await prisma.question.update({
      where: { id },
      data: { title, content },
    });

    if (Array.isArray(tags)) {
      // Remove existing tag links
      await prisma.questionTag.deleteMany({
        where: { questionId: id },
      });

      // Re-create tag links
      for (const tagName of tags) {
        const cleanName = tagName.trim().toLowerCase();
        if (!cleanName) continue;

        const tag = await prisma.tag.upsert({
          where: { slug: cleanName },
          update: {},
          create: {
            name: cleanName,
            slug: cleanName,
          },
        });

        await prisma.questionTag.create({
          data: {
            questionId: id,
            tagId: tag.id,
          },
        });
      }
    }

    const updatedQuestion = await prisma.question.findUnique({
      where: { id },
      include: {
        user: true,
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json(updatedQuestion);
  } catch (err) {
    console.error("PUT question error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const question = await prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    if (question.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.question.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}