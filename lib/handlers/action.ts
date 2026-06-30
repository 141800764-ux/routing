"use server";

import { ZodSchema, ZodError } from "zod";
import { Session } from "next-auth";
import dbConnect from "../mongoose";
import { auth } from "@/auth";
import { ValidationError, UnauthorizedError } from "../http-errors";

type ActionOptions<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
};

async function action<T>({
  params,
  schema,
  authorize = false,
}: ActionOptions<T>) {
  if (schema && params) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        return new ValidationError(
          "Validation Error",
          error.flatten().fieldErrors as Record<string, string[]>
        );
      } else {
        return new Error("Schema Validation Failed");
      }
    }
  }

  let session: Session | null = null;

  if (authorize) {
    session = await auth();
    if (!session) {
      return new UnauthorizedError();
    }
  }

  await dbConnect();

  return { params, session };
}

export default action;