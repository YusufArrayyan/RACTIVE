import { NextResponse } from "next/server";

function formatNumber(num: number): string {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num.toString();
}

export async function POST(req: Request) {
  try {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ error: "Missing YouTube API Key" }, { status: 500 });
    }

    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Extract handle or username from url
    // https://www.youtube.com/@MrBeast -> MrBeast
    // @MrBeast -> MrBeast
    // MrBeast -> MrBeast
    let handle = url.trim();
    if (handle.includes("youtube.com/")) {
      const match = handle.match(/@([a-zA-Z0-9_.-]+)/);
      if (match) {
        handle = match[1];
      } else {
        // Handle youtube.com/c/ or youtube.com/user/ if needed, but for simplicity we rely on handle or search
        const parts = handle.split("/");
        handle = parts[parts.length - 1];
      }
    } else if (handle.startsWith("@")) {
      handle = handle.substring(1);
    }

    // First try fetching by forHandle
    let ytResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=@${handle}&key=${YOUTUBE_API_KEY}`
    );
    let ytData = await ytResponse.json();

    // If not found by handle, try searching by query
    if (!ytResponse.ok || !ytData.items || ytData.items.length === 0) {
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(handle)}&maxResults=1&key=${YOUTUBE_API_KEY}`
      );
      const searchData = await searchRes.json();
      
      if (searchRes.ok && searchData.items && searchData.items.length > 0) {
        const channelId = searchData.items[0].id.channelId;
        ytResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`
        );
        ytData = await ytResponse.json();
      }
    }

    if (!ytData.items || ytData.items.length === 0) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    const channel = ytData.items[0];
    const stats = channel.statistics;
    const snippet = channel.snippet;

    const subCount = parseInt(stats.subscriberCount || "0");
    const videoCount = parseInt(stats.videoCount || "1");
    const viewCount = parseInt(stats.viewCount || "0");
    
    // Fake cadence based on video count and a rough estimate
    const cadence = videoCount > 500 ? "3x/week" : videoCount > 100 ? "1x/week" : "2x/month";
    const avgViewsNum = Math.floor(viewCount / videoCount);
    
    // Fake viral score based on subs
    const viralScore = Math.min(99, Math.floor(70 + (subCount / 1000000) * 5));

    const result = {
      name: snippet.title,
      handle: snippet.customUrl || `@${handle}`,
      thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
      niche: "General", // Default since YT doesn't give precise niche easily
      subs: formatNumber(subCount),
      cadence: cadence,
      avgViews: formatNumber(avgViewsNum),
      viralScore: viralScore,
      description: snippet.description,
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error("Competitor Analysis Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
