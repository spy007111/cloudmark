import { type NextRequest, NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import {
  BookmarksData,
} from "./types";

export async function GET(request: NextRequest) {
  try {
    const KV = getRequestContext().env.cloudmark;
    const entries = await KV.list<BookmarksData>();
    const keys = entries.keys.map((key) => key.name);

    return NextResponse.json({ keys });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}
