import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const question = await prisma.question.update({
    where: {
      id: params.id,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  return NextResponse.json(question);
}