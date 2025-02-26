import { type NextRequest, NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import {
  BookmarkInstance,
  BookmarksData,
  createDefaultBookmarksData,
} from "../../../lib/types";
import { getFavicon } from "@/lib/actions";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mark = searchParams.get("mark") || "default";
    const title = searchParams.get("title") || "Untitled";
    const url = searchParams.get("url");
    const defaultCategory = "Uncategorized";

    // 验证必要参数
    if (!url) {
      return NextResponse.redirect(
        new URL(`/${mark}?status=error&message=urlRequired`, request.url),
      );
    }

    const favicon = await getFavicon(url);

    const bookmark: BookmarkInstance = {
      url: decodeURIComponent(url),
      title: decodeURIComponent(title),
      favicon,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      description: "",
      category: defaultCategory,
    };

    const KV = getRequestContext().env.cloudmark;
    let data = await KV.get<BookmarksData>(mark, "json");
    if (!data) {
      data = createDefaultBookmarksData(mark);
    }

    // 检查是否已存在相同 URL 的书签
    const existingBookmarkIndex = data.bookmarks.findIndex(
      (b) => b.url === bookmark.url,
    );

    if (existingBookmarkIndex !== -1) {
      return NextResponse.redirect(
        new URL(`/${mark}?status=warning&message=bookmarkExists`, request.url),
      );
    }

    data.bookmarks.push(bookmark);
    data.categories = [...new Set(data.bookmarks.map((b) => b.category))];
    await KV.put(mark, JSON.stringify(data));

    return NextResponse.redirect(
      new URL(`/${mark}?status=success&message=bookmarkAdded`, request.url),
    );
  } catch (error) {
    console.error("Error processing bookmark:", error);

    const mark = new URL(request.url).searchParams.get("mark") || "default";
    return NextResponse.redirect(
      new URL(`/${mark}?status=error&message=processingError`, request.url),
    );
  }
}
