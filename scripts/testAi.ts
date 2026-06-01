import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function run() {
  const prompt = `
You are an expert viral content strategist and scriptwriter for "RACTIVE" (an AI Creator OS).
Generate a video script for YouTube about: "human resource".
The writing style should be: "mrbeast".

Provide the output in JSON format with exactly these fields:
- title: A highly clickable, optimized title
- hook: The first 3-5 seconds spoken hook to retain viewers
- script: The full script or outline (depending on platform length) with visual cues in brackets [like this]
- cta: A strong Call to Action for the end
- hashtags: A single string of 5 highly relevant hashtags (e.g. "#viral #tech #ai")

Return ONLY valid JSON, exactly in this format, with no markdown code blocks:
{
  "title": "Example Title",
  "hook": "Example hook...",
  "script": "[SCENE 1]\\nSpeaker: Hello...",
  "cta": "Subscribe for more!",
  "hashtags": "#example #tags"
}
`;
  try {
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();
    console.log("RAW TEXT:", text);
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    console.log("CLEANED:", cleaned);
    console.log("PARSED:", JSON.parse(cleaned));
  } catch (error) {
    console.error("FAILED:", error);
  }
}
run();
