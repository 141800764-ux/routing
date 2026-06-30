"use server";

import mongoose from "mongoose";

import action from "../handlers/action";
import handleError from "../handlers/error";

import { AskQuestionSchema } from "../schemas/question.schema";
import { revalidatePath } from "next/cache";

import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";
import User from "@/database/user.model";

import { ActionResponse, ErrorResponse } from "../types/action";

export async function createQuestion(
  params: CreateQuestionParams
): Promise<ActionResponse<Question>> {
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, tags } = validationResult.params;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Create Question
    const [question] = await Question.create(
      [
        {
          title,
          content,
          author: userId,
        },
      ],
      { session }
    );

    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];

    // Handle Tags
    for (const tag of tags) {
      const tagDoc = await Tag.findOneAndUpdate(
        {
          name: {
            $regex: new RegExp(`^${tag}$`, "i"),
          },
        },
        {
          $setOnInsert: {
            name: tag,
          },
          $inc: {
            questions: 1,
          },
        },
        {
          upsert: true,
          new: true,
          session,
        }
      );

      tagIds.push(tagDoc._id);

      tagQuestionDocuments.push({
        tag: tagDoc._id,
        question: question._id,
      });
    }

    // Create TagQuestion relationships
    if (tagQuestionDocuments.length > 0) {
      await TagQuestion.insertMany(tagQuestionDocuments, {
        session,
      });
    }

    // Link tags to question
    await Question.findByIdAndUpdate(
      question._id,
      {
        $push: {
          tags: {
            $each: tagIds,
          },
        },
      },
      {
        session,
      }
    );

    // Link question to user
    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          questions: question._id,
        },
      },
      {
        session,
      }
    );

    await session.commitTransaction();

    return {
      success: true,
      data: question,
    };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function editQuestion(
  params: EditQuestionParams
): Promise<ActionResponse<Question>> {
  const validationResult = await action({
    params,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId, title, content, tags } = validationResult.params;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const question = await Question.findById(questionId).session(session);

    if (!question) {
      throw new Error("Question not found");
    }

    if (question.author.toString() !== userId) {
      throw new Error("Unauthorized");
    }

    question.title = title;
    question.content = content;

    await question.save({ session });

    // Remove existing tag relationships
    const existingTagQuestions = await TagQuestion.find({
      question: questionId,
    }).session(session);

    const existingTagIds = existingTagQuestions.map(
      (item) => item.tag
    );

    await Tag.updateMany(
      {
        _id: { $in: existingTagIds },
      },
      {
        $inc: { questions: -1 },
      },
      { session }
    );

    await TagQuestion.deleteMany(
      {
        question: questionId,
      },
      { session }
    );

    await Question.findByIdAndUpdate(
      questionId,
      {
        $set: {
          tags: [],
        },
      },
      { session }
    );

    // Add new tags
    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocs = [];

    for (const tag of tags) {
      const tagDoc = await Tag.findOneAndUpdate(
        {
          name: {
            $regex: new RegExp(`^${tag}$`, "i"),
          },
        },
        {
          $setOnInsert: {
            name: tag,
          },
          $inc: {
            questions: 1,
          },
        },
        {
          upsert: true,
          new: true,
          session,
        }
      );

      tagIds.push(tagDoc._id);

      tagQuestionDocs.push({
        tag: tagDoc._id,
        question: questionId,
      });
    }

    if (tagQuestionDocs.length > 0) {
      await TagQuestion.insertMany(tagQuestionDocs, {
        session,
      });
    }

    await Question.findByIdAndUpdate(
      questionId,
      {
        $set: {
          tags: tagIds,
        },
      },
      { session }
    );

    await session.commitTransaction();

    revalidatePath(`/questions/${questionId}`);

    return {
      success: true,
      data: question,
    };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
export async function deleteQuestion(
  params: DeleteQuestionParams
): Promise<ActionResponse<{ deleted: boolean }>> {
  const validationResult = await action({
    params,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const question = await Question.findById(questionId).session(session);

    if (!question) {
      throw new Error("Question not found");
    }

    if (question.author.toString() !== userId) {
      throw new Error("Unauthorized");
    }

    const tagQuestions = await TagQuestion.find({
      question: questionId,
    }).session(session);

    const tagIds = tagQuestions.map((item) => item.tag);

    await Tag.updateMany(
      {
        _id: { $in: tagIds },
      },
      {
        $inc: {
          questions: -1,
        },
      },
      { session }
    );

    await TagQuestion.deleteMany(
      {
        question: questionId,
      },
      { session }
    );

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          questions: questionId,
        },
      },
      { session }
    );

    await Question.findByIdAndDelete(questionId, {
      session,
    });

    await session.commitTransaction();

    revalidatePath("/");

    return {
      success: true,
      data: {
        deleted: true,
      },
    };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
export async function getQuestionById(
  questionId: string
): Promise<ActionResponse<Question>> {
  try {
    const question = await Question.findById(questionId)
      .populate("author", "_id name image")
      .populate("tags");

    if (!question) {
      throw new Error("Question not found");
    }

    return {
      success: true,
      data: question,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}