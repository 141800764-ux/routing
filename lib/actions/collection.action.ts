"use server";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { CollectionBaseSchema } from "../validations";
import { z } from "zod";
import Question from "@/database/question.model";
import Collection from "@/database/collection.model";

type CollectionBaseParams = z.infer<typeof CollectionBaseSchema>;

export async function toggleSaveQuestion(
  params: CollectionBaseParams
): Promise<{ success: boolean; saved?: boolean; message?: string }> {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, "server") as {
      success: false;
      message: string;
    };
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const question = await Question.findById(questionId);
    if (!question) throw new Error("Question not found");

    const existing = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    if (existing) {
      await Collection.deleteOne({ _id: existing._id });
      return { success: true, saved: false };
    }

    await Collection.create({
      question: questionId,
      author: userId,
    });

    return { success: true, saved: true };
  } catch (error) {
    return handleError(error, "server") as {
      success: false;
      message: string;
    };
  }
}

export async function getSavedQuestions(userId: string) {
  try {
    const collections = await Collection.find({ author: userId })
      .populate({
        path: "question",
        populate: [
          { path: "author", model: "User" },
          { path: "tags", model: "Tag" },
        ],
      })
      .sort({ createdAt: -1 });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(collections)),
    };
  } catch (error) {
    return handleError(error, "server") as {
      success: false;
      message: string;
    };
  }
}