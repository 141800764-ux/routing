import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import User from "@/database/user.model";
import { prisma } from "@/lib/prisma";
import { calculateBadgeCounts } from "@/lib/utils/badges";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const user = await User.findById(id).lean();
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    const u = user as any;
    const prismaUser = await prisma.user.findUnique({ where: { email: u.email } });

    let totalQuestions = 0;
    let totalAnswers = 0;
    let totalViews = 0;
    let topPosts: any[] = [];
    let topAnswers: any[] = [];
    let topTags: { name: string; count: number }[] = [];

    if (prismaUser) {
      totalQuestions = await prisma.question.count({ where: { userId: prismaUser.id } });
      totalAnswers = await prisma.answer.count({ where: { userId: prismaUser.id } });

      const allQuestions = await prisma.question.findMany({
        where: { userId: prismaUser.id },
        include: { tags: { include: { tag: true } }, _count: { select: { answers: true } } },
      });

      totalViews = allQuestions.reduce((sum, q) => sum + q.views, 0);

      topPosts = [...allQuestions]
        .sort((a, b) => b.views - a.views)
        .slice(0, 5)
        .map((q) => ({
          id: q.id, title: q.title, views: q.views, likes: q.likes,
          answerCount: q._count.answers, createdAt: q.createdAt,
          tags: q.tags.map((t: any) => t.tag.name),
        }));

      const tagCounts: Record<string, number> = {};
      for (const q of allQuestions) {
        for (const t of q.tags) {
          tagCounts[t.tag.name] = (tagCounts[t.tag.name] || 0) + 1;
        }
      }
      topTags = Object.entries(tagCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const answers = await prisma.answer.findMany({
        where: { userId: prismaUser.id },
        include: {
          question: { include: { tags: { include: { tag: true } } } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      topAnswers = answers.map((a) => ({
        id: a.id,
        questionId: a.questionId,
        questionTitle: a.question.title,
        content: a.content,
        createdAt: a.createdAt,
        tags: a.question.tags.map((t: any) => t.tag.name),
      }));
    }

    const badges = calculateBadgeCounts({ questions: totalQuestions, answers: totalAnswers, views: totalViews });

    return NextResponse.json({
      success: true,
      user: { _id: u._id.toString(), name: u.name, username: u.username, email: u.email, bio: u.bio || "", image: u.image, location: u.location || "", portfolio: u.portfolio || "", reputation: u.reputation || 0, createdAt: u.createdAt },
      stats: { totalQuestions, totalAnswers, badges },
      topPosts,
      topAnswers,
      topTags,
    });
  } catch (error) {
    console.error("GET profile error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Not logged in" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.email !== session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, username, bio, image, email, password } = body;

    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return NextResponse.json(
          { success: false, message: "Username already taken" },
          { status: 409 }
        );
      }
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return NextResponse.json(
          { success: false, message: "Email already in use" },
          { status: 409 }
        );
      }
    }

    if (name !== undefined) user.name = name;
    if (username !== undefined) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (image !== undefined) user.image = image;
    if (email !== undefined) user.email = email;

    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { success: false, message: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }
      const bcrypt = await import("bcryptjs");
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio || "",
        image: user.image,
      },
    });
  } catch (error) {
    console.error("PUT profile error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}