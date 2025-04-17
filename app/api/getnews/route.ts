import { InMemoryCache } from "@/lib/cache/in-memory-cache";
import { NextRequest, NextResponse } from "next/server";
import { getJson } from "serpapi";

export type TNews = {
  position: number;
  title: string;
  source: {
    name: string;
    icon: string;
    authors: string[];
  };
  link: string;
  thumbnail: string;
  thumbnail_small: string;
  date: string;
};

interface IResponse {
  news_results: TNews[];
}

export const GET = async (req: NextRequest) => {
  const cache = InMemoryCache.getInstance();
  const cachedResponse = await cache.get("google_news", ["amazon"]);

  if (cachedResponse) {
    console.log("cached response");
    return NextResponse.json(cachedResponse);
  }
  const response = await getJson({
    engine: "google_news",
    q: "amazon",
    gl: "us",
    hl: "en",
    api_key: process.env.SERP_API,
  });
  await cache.set("google_news", ["amazon"], response.news_results.slice(0, 30), 60);
  const articles: IResponse = response.news_results.slice(0, 30);

  return NextResponse.json(articles);
};
