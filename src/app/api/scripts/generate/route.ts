import { NextResponse } from "next/server";
import { generateScriptWithAI } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { topic, style, platform } = await req.json();

    if (!topic || !style || !platform) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const scriptResult = await generateScriptWithAI(topic, style, platform);

    if (!scriptResult) {
      return NextResponse.json({ error: "AI failed to generate script" }, { status: 500 });
    }

    return NextResponse.json(scriptResult);
  } catch (error) {
    console.error("Script API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
