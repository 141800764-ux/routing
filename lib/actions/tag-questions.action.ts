"use server";

import { prisma } from "@/lib/prisma";
import handleError from "../handlers/error";

export const getQuestionsByTag = async (tag: string) => {
  try {
    const questions = await prisma.question.findMany({
      where: {
        tags: {
          some: {
            tag: {
              name: {
                equals: tag,
                mode: "insensitive",
              },
            },
          },
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: questions,
    };
  } catch (error) {
    return handleError(error);
  }
};