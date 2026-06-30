import { NextResponse } from "next/server";
import { RequestError, ValidationError } from "../http-errors";
import { ZodError } from "zod";

export type ResponseType = "api" | "server";

const formatResponse = (
  error: unknown,
  type: ResponseType = "api"
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: Record<string, string[]> | undefined;

  if (error instanceof RequestError) {
    statusCode = error.statusCode;
    message = error.message;
    errors = error.errors;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errors = error.flatten().fieldErrors as Record<string, string[]>;
  } else if (error instanceof Error) {
    message = error.message;
  }

  if (type === "api") {
    return NextResponse.json(
      {
        success: false,
        message,
        errors,
      },
      { status: statusCode }
    );
  }

  return {
    success: false,
    statusCode,
    message,
    errors,
  };
};

function handleError(error: unknown, type: ResponseType = "api") {
  console.error("handleError caught:", error);
  return formatResponse(error, type);
}

export default handleError;