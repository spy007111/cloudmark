"use server";

import {
  BookmarkInstance,
  type BookmarksData,
  createDefaultBookmarksData,
  defaultMark,
  InsertBookmarkInstance,
  UpdateBookmarkInstance,
} from "@/lib/types";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { DEMO_BOOKMARKS_DATA } from "@/app/demo/demo_data";

// 生成UUID的函数
function generateUUID(): string {
  return crypto.randomUUID();
}

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

interface BookmarkActionOptions {
  isDemo?: boolean;
}

export async function getBookmarkData(
  data: {
    mark: string;
  },
  options?: BookmarkActionOptions,
) {
  const { mark } = data;

  // 如果是demo模式，直接返回演示数据
  if (options?.isDemo) {
    return DEMO_BOOKMARKS_DATA;
  }

  const KV = getCloudflareContext().env.cloudmark;
  let bookmarksdata = await KV.get<BookmarksData>(mark, "json");
  if (!bookmarksdata) {
    bookmarksdata = createDefaultBookmarksData(mark);
    await KV.put(mark, JSON.stringify(bookmarksdata));
  }
  return bookmarksdata;
}

export async function createBookmark(
  data: InsertBookmarkInstance,
  options?: BookmarkActionOptions,
) {
  const { mark, ...bookmarkData } = data;
  const isDemo = options?.isDemo || false;

  const newUuid = generateUUID();
  const favicon = await getFavicon(bookmarkData.url);
  const newBookmark: BookmarkInstance = {
    uuid: newUuid,
    ...bookmarkData,
    favicon,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
  };

  if (isDemo) {
    return newBookmark;
  }

  const KV = getCloudflareContext().env.cloudmark;
  let bookmarksdata = await KV.get<BookmarksData>(mark, "json");
  if (!bookmarksdata) {
    bookmarksdata = createDefaultBookmarksData(mark);
  }

  bookmarksdata.bookmarks.push(newBookmark);
  await KV.put(mark, JSON.stringify(bookmarksdata));
  return newBookmark;
}

export async function updateBookmark(
  data: UpdateBookmarkInstance,
  options?: BookmarkActionOptions,
) {
  const { mark, uuid, ...bookmarkData } = data;
  const isDemo = options?.isDemo || false;
  let bookmarksdata: BookmarksData | null = null;
  if (isDemo) {
    bookmarksdata = DEMO_BOOKMARKS_DATA;
  } else {
    const KV = getCloudflareContext().env.cloudmark;
    bookmarksdata = await KV.get<BookmarksData>(mark, "json");
  }

  if (!bookmarksdata) {
    return;
  }

  const bookmarkIndex = bookmarksdata.bookmarks.findIndex(
    (b) => b.uuid === uuid,
  );
  if (bookmarkIndex === -1) {
    return;
  }

  const updatedBookmark: BookmarkInstance = {
    ...bookmarksdata.bookmarks[bookmarkIndex],
    ...bookmarkData,
    modifiedAt: new Date().toISOString(),
  };

  bookmarksdata.bookmarks[bookmarkIndex] = updatedBookmark;
  if (isDemo) {
    return updatedBookmark;
  }
  const KV = getCloudflareContext().env.cloudmark;
  await KV.put(mark, JSON.stringify(bookmarksdata));
  return updatedBookmark;
}

export async function deleteBookmarkData(
  data: {
    mark: string;
    uuid: string;
  },
  options?: BookmarkActionOptions,
) {
  const { mark, uuid } = data;
  const isDemo = options?.isDemo || false;

  // Demo模式下不执行实际操作,直接返回
  if (isDemo) {
    return;
  }

  const KV = getCloudflareContext().env.cloudmark;
  const bookmarksdata = await KV.get<BookmarksData>(mark, "json");
  if (!bookmarksdata) {
    return;
  }

  // 使用UUID删除书签
  bookmarksdata.bookmarks = bookmarksdata.bookmarks.filter(
    (b) => b.uuid !== uuid,
  );

  await KV.put(mark, JSON.stringify(bookmarksdata));
  return;
}
