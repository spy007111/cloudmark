"use server";

import {
  BookmarkInstance,
  type BookmarksData,
  createDefaultBookmarksData,
  defaultMark,
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
  formData: FormData,
  options?: BookmarkActionOptions,
) {
  const mark = (formData.get("mark") || defaultMark) as string;

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

export async function putBookmarkData(
  formData: FormData,
  options?: BookmarkActionOptions,
) {
  const mark = (formData.get("mark") || defaultMark) as string;
  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const uuid = formData.get("uuid") as string; // 从表单中获取UUID
  const favicon = await getFavicon(url);

  // Demo模式下,创建新书签但不实际存储
  if (options?.isDemo) {
    const newUuid = uuid || generateUUID();
    const newBookmark: BookmarkInstance = {
      uuid: newUuid,
      url,
      title,
      favicon,
      category,
      description,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
    };
    return newBookmark;
  }

  const KV = getCloudflareContext().env.cloudmark;
  let bookmarksdata = await KV.get<BookmarksData>(mark, "json");
  if (!bookmarksdata) {
    bookmarksdata = createDefaultBookmarksData(mark);
  }

  // 使用UUID查找书签
  const bookmark = uuid
    ? bookmarksdata.bookmarks.find((b) => b.uuid === uuid)
    : null;

  let newBookmark: BookmarkInstance;

  if (bookmark) {
    // 更新现有书签
    bookmark.url = url;
    bookmark.title = title;
    bookmark.favicon = favicon;
    bookmark.category = category;
    bookmark.description = description;
    bookmark.modifiedAt = new Date().toISOString();
    newBookmark = bookmark;
  } else {
    // 创建新书签
    const newUuid = generateUUID();
    const newBookmarkItem: BookmarkInstance = {
      uuid: newUuid,
      url,
      title,
      favicon,
      category,
      description,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
    };
    bookmarksdata.bookmarks.push(newBookmarkItem);
    newBookmark = newBookmarkItem;
  }

  await KV.put(mark, JSON.stringify(bookmarksdata));
  return newBookmark;
}

export async function updateBookmarkData(
  formData: FormData,
  options?: BookmarkActionOptions,
) {
  const uuid = formData.get("uuid") as string;
  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const favicon = await getFavicon(url);

  // Demo模式下,返回更新后的书签但不实际存储
  if (options?.isDemo) {
    const updatedBookmark: BookmarkInstance = {
      uuid,
      url,
      title,
      favicon,
      category,
      description,
      createdAt: new Date().toISOString(), // 在demo模式下我们没有原始数据,所以用当前时间
      modifiedAt: new Date().toISOString(),
    };
    return updatedBookmark;
  }

  const mark = (formData.get("mark") || defaultMark) as string;
  const KV = getCloudflareContext().env.cloudmark;
  let bookmarksdata = await KV.get<BookmarksData>(mark, "json");
  if (!bookmarksdata) {
    return null;
  }

  const bookmarkIndex = bookmarksdata.bookmarks.findIndex(
    (b) => b.uuid === uuid,
  );
  if (bookmarkIndex === -1) {
    return null;
  }

  // 更新书签
  const updatedBookmark: BookmarkInstance = {
    ...bookmarksdata.bookmarks[bookmarkIndex],
    url,
    title,
    favicon,
    category,
    description,
    modifiedAt: new Date().toISOString(),
  };

  bookmarksdata.bookmarks[bookmarkIndex] = updatedBookmark;
  await KV.put(mark, JSON.stringify(bookmarksdata));
  return updatedBookmark;
}

export async function deleteBookmarkData(
  formData: FormData,
  options?: BookmarkActionOptions,
) {
  // Demo模式下不执行实际操作,直接返回
  if (options?.isDemo) {
    return;
  }

  const mark = (formData.get("mark") || defaultMark) as string;
  const uuid = formData.get("uuid") as string;

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
}
