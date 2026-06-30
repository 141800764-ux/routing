import { NextResponse } from "next/server";

import Account from "@/database/account.model";
import User from "@/database/user.model";

import dbConnect from "@/lib/mongoose";
import handleError from "@/lib/handlers/error";

import { AccountSchema } from "@/lib/validations";

import type { APIErrorResponse } from "@/types/global";

export async function GET() {
  try {
    await dbConnect();

    const accounts = await Account.find();

    return NextResponse.json(
      { success: true, data: accounts },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    const validatedData = AccountSchema.parse(body);

    const existingAccount = await Account.findOne({
      provider: validatedData.provider,
      providerAccountId: validatedData.providerAccountId,
    });

    if (existingAccount) {
      throw new Error("User already exists");
    }

    const existingUsername = await User.findOne({
      username: validatedData.username,
    });

    if (existingUsername) {
      throw new Error("Username already exists");
    }

    const newUser = await User.create(validatedData.data);

    return NextResponse.json(
      {
        success: true,
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}