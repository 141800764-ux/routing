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
  const { targetId, targetType, voteType } = await req.json();
  if (!targetId || !targetType || !voteType) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const voter = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!voter) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  if (targetType === "question") {
    const question = await prisma.question.findUnique({ where: { id: targetId }, include: { user: true } });
    const existing = await prisma.questionVote.findUnique({ where: { userId_questionId: { userId: voter.id, questionId: targetId } } });
    if (existing) {
      if (existing.voteType === voteType) {
        await prisma.questionVote.delete({ where: { id: existing.id } });
        if (question?.user?.email) await adjustReputation(question.user.email, voteType === "upvote" ? -10 : 2);
      } else {
        await prisma.questionVote.update({ where: { id: existing.id }, data: { voteType } });
        if (question?.user?.email) await adjustReputation(question.user.email, voteType === "upvote" ? 12 : -12);
      }
    } else {
      await prisma.questionVote.create({ data: { userId: voter.id, questionId: targetId, voteType } });
      if (question?.user?.email) await adjustReputation(question.user.email, voteType === "upvote" ? 10 : -2);
    }
    return NextResponse.json({ success: true });
  }
  if (targetType === "answer") {
    const answer = await prisma.answer.findUnique({ where: { id: targetId }, include: { user: true } });
    const existing = await prisma.answerVote.findUnique({ where: { userId_answerId: { userId: voter.id, answerId: targetId } } });
    if (existing) {
      if (existing.voteType === voteType) {
        await prisma.answerVote.delete({ where: { id: existing.id } });
        if (answer?.user?.email) await adjustReputation(answer.user.email, voteType === "upvote" ? -10 : 2);
      } else {
        await prisma.answerVote.update({ where: { id: existing.id }, data: { voteType } });
        if (answer?.user?.email) await adjustReputation(answer.user.email, voteType === "upvote" ? 12 : -12);
      }
    } else {
      await prisma.answerVote.create({ data: { userId: voter.id, answerId: targetId, voteType } });
      if (answer?.user?.email) await adjustReputation(answer.user.email, voteType === "upvote" ? 10 : -2);
    }
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: "Invalid targetType" }, { status: 400 });
}
