import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ error: "Missing YouTube API Key" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const regionCode = searchParams.get("region") || "US";

    const ytResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=${regionCode}&maxResults=15&key=${YOUTUBE_API_KEY}`
    );

    if (!ytResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch YouTube trends" }, { status: ytResponse.status });
    }

    const ytData = await ytResponse.json();
    
    const realTrends = ytData.items?.map((item: any, i: number) => {
      const views = parseInt(item.statistics.viewCount || "0");
      const likes = parseInt(item.statistics.likeCount || "0");
      const engagement = views > 0 ? (likes / views) * 100 : 0;
      const score = Math.min(100, Math.floor(80 + (views / 1000000) * 10));

      return {
        id: item.id,
        title: item.snippet.title,
        niche: "Tech",
        platform: "YouTube",
        country: regionCode === "ID" ? "Indonesia" : regionCode === "JP" ? "Japan" : regionCode === "KR" ? "Korea" : regionCode === "IN" ? "India" : regionCode === "GB" ? "UK" : "Global",
        thumbnail: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || "",
        viralScore: score,
        opportunityScore: Math.min(100, score + 5),
        saturationLevel: views > 1000000 ? "High" : views > 100000 ? "Medium" : "Low",
        trendVelocity: "Exploding",
        estimatedViews: views,
        engagementRate: parseFloat(engagement.toFixed(1)),
        hookPattern: "Curiosity gap in the first 3 seconds",
        editingStyle: "Fast-paced, high retention",
        audienceBehavior: "High interaction and sharing",
        growthData: [
          { day: "Mon", score: Math.max(0, score - 20 + Math.floor(Math.random() * 10)) },
          { day: "Tue", score: Math.max(0, score - 15 + Math.floor(Math.random() * 10)) },
          { day: "Wed", score: Math.max(0, score - 10 + Math.floor(Math.random() * 10)) },
          { day: "Thu", score: Math.max(0, score - 5 + Math.floor(Math.random() * 5)) },
          { day: "Fri", score },
        ],
        hashtags: item.snippet.tags?.slice(0, 5) || ["#viral", "#trending"]
      };
    }) || [];

    return NextResponse.json(realTrends);
  } catch (error) {
    console.error("Trend Hunter Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
