import { auth } from "@/auth";
import Collection from "@/database/collection.model";
import dbConnect from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Not logged in" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const userId = (session.user as any).id;

    const collections = await Collection.find({ author: userId }).sort({
      createdAt: -1,
    });

    let filtered = collections;

    if (query) {
      filtered = collections.filter((c: any) =>
        c.questionTitle?.toLowerCase().includes(query.toLowerCase())
      );
    }

    return NextResponse.json({ success: true, collections: filtered });
  } catch (error) {
    console.error("GET collections error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Not logged in" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { questionId, questionTitle } = await request.json();
    const userId = (session.user as any).id;

    if (!questionId) {
      return NextResponse.json(
        { success: false, message: "Missing questionId" },
        { status: 400 }
      );
    }

    const existing = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    if (existing) {
      await Collection.deleteOne({ _id: existing._id });
      return NextResponse.json({ success: true, saved: false });
    }

    await Collection.create({
      question: questionId,
      questionTitle: questionTitle || "",
      author: userId,
    });

    return NextResponse.json({ success: true, saved: true });
  } catch (error) {
    console.error("POST collections error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}