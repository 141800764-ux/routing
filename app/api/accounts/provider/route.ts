import { NextResponse } from "next/server";

import Account from "@/database/account.model";

import dbConnect from "@/lib/mongoose";
import handleError from "@/lib/handlers/error";

import type { APIErrorResponse } from "@/types/global";

interface RouteParams {
  params: {
    provider: string;
  };
}

// GET ACCOUNT BY PROVIDER
export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    await dbConnect();

    const accounts = await Account.find({
      provider: params.provider,
    });

    return NextResponse.json(
      {
        success: true,
        data: accounts,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// DELETE ACCOUNTS BY PROVIDER
export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  try {
    await dbConnect();

    const deletedAccounts = await Account.deleteMany({
      provider: params.provider,
    });

    return NextResponse.json(
      {
        success: true,
        data: deletedAccounts,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}