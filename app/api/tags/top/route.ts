import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";

export async function GET() {
  try {
    await dbConnect();

    const topTags = await Question.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", questionCount: { $sum: 1 } } },
      { $sort: { questionCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "_id",
          as: "tag",
        },
      },
      { $unwind: "$tag" },
      {
        $project: {
          _id: 0,
          tagId: "$tag._id",
          name: "$tag.name",
          slug: "$tag.slug",
          description: "$tag.description",
          questionCount: 1,
        },
      },
    ]);

    return NextResponse.json({ success: true, tags: topTags });
  } catch (error) {
    console.error("[GET /api/tags/top]", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}