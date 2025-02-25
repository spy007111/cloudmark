import { type NextRequest, NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import {
  BookmarkInstance,
  BookmarksData,
  createDefaultBookmarksData,
} from "../../types";

// GET /api/bookmarks/[id] - 获取书签集合
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const KV = getRequestContext().env.cloudmark;

    // 查找书签
    let bookmarksdata = await KV.get<BookmarksData>(id, "json");
    if (!bookmarksdata) {
      bookmarksdata = createDefaultBookmarksData(id);
      await KV.put(id, JSON.stringify(bookmarksdata));
    }

    return NextResponse.json({ bookmarksdata });
  } catch (error) {
    console.error("Error fetching bookmark:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmark" },
      { status: 500 }
    );
  }
}

// PUT /api/bookmarks/[id] - 更新书签
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const bookmark = await request.json<BookmarkInstance>();

    const KV = getRequestContext().env.cloudmark;
    let bookmarksdata = await KV.get<BookmarksData>(id, "json");
    if (!bookmarksdata) {
      bookmarksdata = createDefaultBookmarksData(id);
    }

    // 查找书签索引
    const index = bookmarksdata.bookmarks.findIndex(
      (b) => b.url === bookmark.url
    );

    if (index === -1) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 }
      );
    }

    bookmarksdata.bookmarks[index] = {
      ...bookmarksdata.bookmarks[index],
      ...bookmark,
      modifiedAt: new Date().toISOString(),
    };
    bookmarksdata.categories = [
      ...new Set(bookmarksdata.bookmarks.map((b) => b.category)),
    ];

    await KV.put(id, JSON.stringify(bookmarksdata));

    return NextResponse.json({
      message: "Bookmark updated successfully",
      bookmark: bookmarksdata.bookmarks[index],
    });
  } catch (error) {
    console.error("Error updating bookmark:", error);
    return NextResponse.json(
      { error: "Failed to update bookmark" },
      { status: 500 }
    );
  }
}

// DELETE /api/bookmarks/[id] - 删除书签
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const bookmark = await request.json<BookmarkInstance>();
    const KV = getRequestContext().env.cloudmark;

    let bookmarksdata = await KV.get<BookmarksData>(id, "json");
    if (!bookmarksdata) {
      return NextResponse.json(
        { error: "Bookmark collection not found" },
        { status: 404 }
      );
    }

    // 查找书签索引
    const index = bookmarksdata.bookmarks.findIndex(
      (b) => b.url === bookmark.url
    );

    if (index === -1) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 }
      );
    }
    bookmarksdata.bookmarks.splice(index, 1);
    bookmarksdata.categories = [
      ...new Set(bookmarksdata.bookmarks.map((b) => b.category)),
    ];

    await KV.put(id, JSON.stringify(bookmarksdata));

    return NextResponse.json({
      message: "Bookmark deleted successfully",
      bookmark,
    });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}
