import { NextResponse } from "next/server";
import { generateStoryboardWithAI } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Missing topic" }, { status: 400 });
    }

    const scenes = await generateStoryboardWithAI(topic);

    if (!scenes || !Array.isArray(scenes)) {
      return NextResponse.json({ error: "AI failed to generate storyboard" }, { status: 500 });
    }

    return NextResponse.json(scenes);
  } catch (error) {
    console.error("Storyboard API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
