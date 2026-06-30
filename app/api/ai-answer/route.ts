import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: "Missing question title" },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a helpful developer assistant answering a question on a developer Q&A platform.

Question: ${title}

${content ? `Details: ${content}` : ""}

Provide a clear, concise, and helpful answer. Use code examples where relevant. Keep the response practical and easy to understand.`,
        },
      ],
    });

    const answer =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ answer });
  } catch (err) {
    console.error("AI answer error:", err);
    return NextResponse.json(
      { error: "Failed to generate answer" },
      { status: 500 }
    );
  }
}