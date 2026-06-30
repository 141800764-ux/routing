import handleError from "@/lib/handlers/error";
import dbConnect from "@/lib/mongoose";
import User from "@/database/user.model";
import { prisma } from "@/lib/prisma";
import { ValidationError } from "@/lib/http-errors";
import { UserSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("=== /api/users GET called ===");
    console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✅" : "❌ missing");
    console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✅" : "❌ missing");

    await dbConnect();
    console.log("✅ dbConnect OK");

    const prismaTest = await prisma.user.findFirst();
    console.log("✅ Prisma OK:", prismaTest ? "found user" : "no users yet");

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;
    const skip = (page - 1) * pageSize;

    const filter = query
      ? {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { username: { $regex: query, $options: "i" } },
          ],
        }
      : {};

    const totalUsers = await User.countDocuments(filter);

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const usersWithCounts = await Promise.all(
      users.map(async (u: any) => {
        const prismaUser = await prisma.user.findUnique({
          where: { email: u.email },
        });

        let questionCount = 0;
        let topTag: string | null = null;

        if (prismaUser) {
          const userQuestions = await prisma.question.findMany({
            where: { userId: prismaUser.id },
            include: { tags: { include: { tag: true } } },
          });

          questionCount = userQuestions.length;

          const tagCounts: Record<string, number> = {};
          for (const q of userQuestions) {
            for (const t of q.tags) {
              tagCounts[t.tag.name] = (tagCounts[t.tag.name] || 0) + 1;
            }
          }

          const sorted = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
          topTag = sorted.length > 0 ? sorted[0][0] : null;
        }

        return { ...u, questionCount, topTag };
      })
    );

    const allQuestions = await prisma.question.findMany({
      include: { tags: { include: { tag: true } } },
    });

    const globalTagCounts: Record<string, number> = {};
    for (const q of allQuestions) {
      for (const t of q.tags) {
        globalTagCounts[t.tag.name] = (globalTagCounts[t.tag.name] || 0) + 1;
      }
    }

    const popularTags = Object.entries(globalTagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const isNext = totalUsers > skip + users.length;

    return NextResponse.json({
      success: true,
      users: usersWithCounts,
      popularTags,
      isNext,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const validatedData = UserSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(
        "Validation Error",
        validatedData.error.flatten().fieldErrors
      );
    }

    const { email, name } = validatedData.data;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 409 }
      );
    }

    const user = await User.create({
      email,
      name,
      username: email.split("@")[0],
      image: "",
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}