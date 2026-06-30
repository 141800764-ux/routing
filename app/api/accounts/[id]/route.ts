import { NextResponse } from "next/server";

import Account from "@/database/account.model";

import dbConnect from "@/lib/mongoose";
import handleError from "@/lib/handlers/error";

import type { APIErrorResponse } from "@/types/global";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET ACCOUNT BY ID
export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    await dbConnect();

    const account = await Account.findById(params.id);

    if (!account) {
      throw new Error("Account not found");
    }

    return NextResponse.json(
      {
        success: true,
        data: account,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// UPDATE ACCOUNT
export async function PATCH(
  request: Request,
  { params }: RouteParams
) {
  try {
    await dbConnect();

    const body = await request.json();

    const updatedAccount = await Account.findByIdAndUpdate(
      params.id,
      body,
      {
        new: true,
      }
    );

    if (!updatedAccount) {
      throw new Error("Account not found");
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedAccount,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// DELETE ACCOUNT
export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  try {
    await dbConnect();

    const deletedAccount = await Account.findByIdAndDelete(
      params.id
    );

    if (!deletedAccount) {
      throw new Error("Account not found");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}