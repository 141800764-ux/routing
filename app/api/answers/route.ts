import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/database/user.model";

async function adjustReputation(email: string, points: number) {
  await dbConnect();
  await User.findOneAndUpdate({ email }, { $inc: { reputation: points } });
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { questionId, content } = await req.json();

  if (!questionId || !content?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const answer = await prisma.answer.create({
    data: {
      content,
      questionId,
      userId: user.id,
    },
    include: {
      user: true,
      comments: { include: { user: true } },
    },
  });

  // +10 reputation for posting an answer
  await adjustReputation(session.user.email, 10);

  return NextResponse.json(answer);
}