import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function analyzeTrendsWithAI(youtubeData: any[]) {
  const prompt = `
You are the intelligence engine for "RACTIVE", an AI Creator OS.
Here is a list of currently trending YouTube videos:
${JSON.stringify(youtubeData)}

Your task is to analyze these videos, identify 4 macro-trends or specific topics that are "exploding" right now, and return them as a JSON array. 
For each trend, provide:
- topic: A short, catchy name for the trend (max 5 words)
- niche: The category (e.g., "AI", "Finance", "Lifestyle", "Gaming", "Tech")
- score: A viral score from 1-100 (assign higher scores to tech/finance/AI)
- vel: Velocity string, either "Exploding" or "Rising"
- color: A hex color code that fits the niche (e.g., #F59E0B for AI, #10B981 for Finance, #8B5CF6 for Tech, #EC4899 for Lifestyle)

Return ONLY valid JSON, exactly in this format, with no markdown code blocks:
[
  { "topic": "AI-Generated Income", "niche": "AI", "score": 94, "vel": "Exploding", "color": "#F59E0B" }
]
`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();
    // Clean up potential markdown formatting
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return null;
  }
}

export async function generateScriptWithAI(topic: string, style: string, platform: string) {
  const prompt = `
You are RACTIVE, an elite AI Creator OS. Your task is to expand the user's simple topic into a highly professional, engaging video script.

USER TOPIC: "${topic}"
TARGET PLATFORM: "${platform}"
WRITING STYLE: "${style}"

STEP 1: PERSONA INFERENCE
First, automatically adopt the most authoritative persona for this topic. 
(For example: if the topic is "CV ATS vs Creative", act as a Senior HR Director at a Fortune 500 company and an expert career content creator. If it's about "Finance", act as a seasoned wealth manager).

STEP 2: SCRIPT GENERATION
Generate a premium, highly engaging video script from the perspective of that persona.

Provide the output in JSON format with exactly these fields:
- title: A highly clickable, optimized title (click-magnet but not clickbait)
- hook: The first 3-5 seconds spoken hook designed to retain 90% of viewers. Use psychological triggers.
- script: The full script or outline with visual cues in brackets [Visual: B-roll of...]
- cta: A strong, organic Call to Action for the end
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
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Script generation failed:", error);
    return null;
  }
}

export async function generateStoryboardWithAI(topic: string) {
  const prompt = `
You are an expert film director and AI video strategist.
Create a 5-scene storyboard for a short-form video about: "${topic}".

For each scene, you must provide:
- label: Scene title (e.g., "Scene 1 - Hook")
- desc: Brief visual description of what happens
- camera: Camera angle and movement (e.g., "Medium Close-up, Dolly in")
- lighting: Lighting style (e.g., "Dramatic, high contrast")
- audio: Sound effects or music cues
- imagePrompt: A highly detailed, descriptive prompt for an AI image generator to create a cinematic storyboard frame representing this scene. The prompt should be comma-separated, focusing on visual elements, subject, background, lighting, and camera angle.

Output EXACTLY as a JSON array of objects. Example:
[
  {
    "id": 1,
    "label": "Scene 1 - Hook",
    "desc": "Wide shot of...",
    "camera": "Wide Shot",
    "lighting": "Natural daylight",
    "audio": "Fast whoosh sound",
    "imagePrompt": "cinematic wide shot, professional office, businessman looking shocked at laptop, cinematic lighting, 8k, photorealistic"
  }
]
Return ONLY the JSON array, no markdown.
`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Storyboard generation failed:", error);
    return null;
  }
}
