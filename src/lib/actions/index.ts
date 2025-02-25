"use server";

import {
  BookmarkInstance,
  type BookmarksData,
  createDefaultBookmarksData,
  defaultMark,
} from "@/lib/types";
import { getRequestContext } from "@cloudflare/next-on-pages";

export async function getFavicon(url: string, size: number = 64) {
  const domain = new URL(url).hostname.replace("www.", "");
  // const faviconResponse = await fetch(`https://favicone.com/${domain}?json`);
  // const faviconData = await faviconResponse.json<{
  //   hasIcon: boolean;
  //   icon: string;
  //   format: string;
  // }>();
  // const favicon = faviconData.hasIcon ? faviconData.icon : "";
  // return favicon;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

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
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const favicon = await getFavicon(url);

  const KV = getRequestContext().env.cloudmark;
  let bookmarksdata = await KV.get<BookmarksData>(mark, "json");
  if (!bookmarksdata) {
    bookmarksdata = createDefaultBookmarksData(mark);
  }
  const bookmark = bookmarksdata.bookmarks.find((b) => b.url === url);
  let newBookmark: BookmarkInstance;
  if (bookmark) {
    bookmark.title = title;
    bookmark.favicon = favicon;
    bookmark.category = category;
    bookmark.description = description; // 更新描述
    bookmark.modifiedAt = new Date().toISOString();
    newBookmark = bookmark;
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
    newBookmark = bookmarksdata.bookmarks[bookmarksdata.bookmarks.length - 1];
  }
  bookmarksdata.categories = [
    ...new Set(bookmarksdata.bookmarks.map((b) => b.category)),
  ];
  await KV.put(mark, JSON.stringify(bookmarksdata));
  return newBookmark;
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
