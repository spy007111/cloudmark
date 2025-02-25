"use server";

import {
  type BookmarksData,
  createDefaultBookmarksData,
  defaultMark,
} from "@/lib/types";
import { getRequestContext } from "@cloudflare/next-on-pages";

export async function getBookmarkData(formData: FormData) {
  const mark = (formData.get("mark") || defaultMark) as string;
  const KV = getRequestContext().env.cloudmark;
  let bookmarksdata = await KV.get<BookmarksData>(mark, "json");
  if (!bookmarksdata) {
    bookmarksdata = createDefaultBookmarksData(mark);
    await KV.put(mark, JSON.stringify(bookmarksdata));
  }
  return bookmarksdata;
}

export async function putBookmarkData(formData: FormData) {
  const mark = (formData.get("mark") || defaultMark) as string;
  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const favicon = formData.get("favicon") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string; // 添加描述字段

  const KV = getRequestContext().env.cloudmark;
  let bookmarksdata = await KV.get<BookmarksData>(mark, "json");
  if (!bookmarksdata) {
    bookmarksdata = createDefaultBookmarksData(mark);
  }
  const bookmark = bookmarksdata.bookmarks.find((b) => b.url === url);
  if (bookmark) {
    bookmark.title = title;
    bookmark.favicon = favicon;
    bookmark.category = category;
    bookmark.description = description; // 更新描述
    bookmark.modifiedAt = new Date().toISOString();
  } else {
    bookmarksdata.bookmarks.push({
      url,
      title,
      favicon,
      category,
      description, // 添加描述
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
    });
  }
  bookmarksdata.categories = [
    ...new Set(bookmarksdata.bookmarks.map((b) => b.category)),
  ];
  await KV.put(mark, JSON.stringify(bookmarksdata));
}

export async function deleteBookmarkData(formData: FormData) {
  const mark = (formData.get("mark") || defaultMark) as string;
  const url = formData.get("url") as string;

  const KV = getRequestContext().env.cloudmark;
  const bookmarksdata = await KV.get<BookmarksData>(mark, "json");
  if (!bookmarksdata) {
    return;
  }
  bookmarksdata.bookmarks = bookmarksdata.bookmarks.filter(
    (b) => b.url !== url
  );
  bookmarksdata.categories = [
    ...new Set(bookmarksdata.bookmarks.map((b) => b.category)),
  ];
  await KV.put(mark, JSON.stringify(bookmarksdata));
}
