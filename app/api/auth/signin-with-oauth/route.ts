import mongoose from "mongoose";
import slugify from "slugify";
import { NextResponse } from "next/server";

import dbConnect from "@/lib/mongoose";
import handleError from "@/lib/handlers/error";
import User from "@/database/user.model";
import Account from "@/database/account.model";

export async function POST(request: Request) {
  await dbConnect();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { provider, providerAccountId, user } = await request.json();
    const { name, username, email, image } = user;

    const slugifiedUsername = slugify(username || name, {
      lower: true,
      strict: true,
      trim: true,
    });

    let existingUser = await User.findOne({ email }).session(session);

    if (!existingUser) {
      const users = await User.create(
        [{ name, username: slugifiedUsername, email, image }],
        { session }
      );
      existingUser = users[0];
    } else {
      const updatedData: { name?: string; image?: string } = {};
      if (existingUser.name !== name) updatedData.name = name;
      if (existingUser.image !== image) updatedData.image = image;
      if (Object.keys(updatedData).length > 0) {
        await User.updateOne(
          { _id: existingUser._id },
          { $set: updatedData }
        ).session(session);
      }
    }

    const existingAccount = await Account.findOne({
      provider,
      providerAccountId,
    }).session(session);

    if (!existingAccount) {
      await Account.create(
        [{ userId: existingUser._id, name, image, provider, providerAccountId }],
        { session }
      );
    }

    await session.commitTransaction();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    await session.abortTransaction();
    return handleError(error, "api") as unknown as Response;
  } finally {
    session.endSession();
  }
}