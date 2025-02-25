import { type NextRequest, NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { BookmarkInstance, BookmarksData, createDefaultBookmarksData } from "../types";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mark = searchParams.get("mark") || "default";
    const title = searchParams.get("title") || "Untitled";
    const url = searchParams.get("url");
    const favicon = searchParams.get("favicon") || "";
    const defaultCategory = "Uncategorized";

    // 验证必要参数
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const bookmark: BookmarkInstance = {
      url: decodeURIComponent(url),
      title: decodeURIComponent(title),
      favicon: decodeURIComponent(favicon),
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      category: defaultCategory,
    };

    const KV = getRequestContext().env.cloudmark;
    let data = await KV.get<BookmarksData>(mark, "json");
    if (!data) {
      data = createDefaultBookmarksData(mark);
    }

    data.bookmarks.push(bookmark);
    data.categories = [...new Set(data.bookmarks.map((b) => b.category))];
    await KV.put(mark, JSON.stringify(data));

    // 重定向到成功页面
    return NextResponse.redirect(
      new URL(`/bookmarks/${mark}`, request.url)
    );
  } catch (error) {
    console.error("Error processing bookmark:", error);
    // 重定向到错误页面
    return NextResponse.redirect(new URL("/bookmarks/error", request.url));
  }
}
