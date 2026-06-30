"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "@/database/user.model";
import { SignUpSchema } from "../validations";
import action from "../handlers/actions";
import handleError from "../handlers/error";
import { SigninWithOAuthSchema } from "../validations";


export async function signUpWithCredentials(
  params: AuthCredentials
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: SignUpSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, username, email, password } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({
      email,
    }).session(session);

    if (existingUser) {
      throw new Error("Email already in use");
    }

    const existingUsername = await User.findOne({
      username,
    }).session(session);

    if (existingUsername) {
      throw new Error("Username already taken");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [user] = await User.create(
      [
        {
          name,
          username,
          email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
export async function SignUpWithOAuthSchema{

}

export async function signInWithCredentials(
  params: Pick<AuthCredentials, "email" | "password">
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: SigninWithOAuthSchema, // rename this to SignInSchema if possible
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { email, password } = validationResult.params!;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.password) {
      throw new Error(
        "This account was created with Google/GitHub. Please sign in with OAuth."
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}