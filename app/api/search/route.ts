import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("query")?.toLowerCase() || "";

  if (!query) {
    return NextResponse.json([]);
  }

  const results = await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
          },
        },
        {
          email: {
            contains: query,
          },
        },
        {
          username: {
            contains: query,
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
    },
    take: 10,
  });

  return NextResponse.json(results);
}