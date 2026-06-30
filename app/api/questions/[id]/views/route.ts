import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const question = await prisma.question.update({
    where: { id },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  return NextResponse.json(question);
}