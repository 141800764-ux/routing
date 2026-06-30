import dbConnect from "@/lib/mongoose";
import User from "@/database/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const user = await User.findById("6a330f4ab27ea33001f7306a").lean();
  return NextResponse.json(user);
}
