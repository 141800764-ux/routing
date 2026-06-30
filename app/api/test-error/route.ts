import { NextResponse } from "next/server";
import { ValidationError } from "@/lib/http-errors";
import formatResponse from "@/lib/handlers/error";

export async function GET() {
  try {
    throw new ValidationError("Test error");
  } catch (error) {
    return formatResponse(error, "api"); // uses NextResponse internally
  }
}