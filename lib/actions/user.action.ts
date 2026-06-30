"use server";

import { z } from "zod";
import action from "../handlers/action";
import handleError from "../handlers/error";
import User from "@/database/user.model";

const PaginatedSearchParamsSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(10),
  query: z.string().optional().default(""),
  filter: z.string().optional().default(""),
  sort: z.string().optional().default("newest"),
});

type PaginatedSearchParams = z.infer<typeof PaginatedSearchParamsSchema>;

export async function getUsers(params: PaginatedSearchParams) {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, "server");
  }

  const { params: validParams } = validationResult as {
    params: PaginatedSearchParams;
  };

  const { page = 1, pageSize = 10, query } = validParams;

  const skip = (page - 1) * pageSize;

  try {
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
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const isNext = totalUsers > skip + users.length;

    return {
      success: true,
      data: {
        users: JSON.parse(JSON.stringify(users)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error, "server");
  }
}