"use client";

import { useState, useEffect, useCallback } from "react";
import { BookmarksUI } from "@/components/bookmarks-ui";
import type { BookmarkInstance } from "@/lib/types";
import { getBookmarkData, putBookmarkData, updateBookmarkData, deleteBookmarkData } from "@/lib/actions";
import { DEMO_BOOKMARKS_DATA } from "./demo_data";
import "./page.css";

export default function DemoPage() {
  const [bookmarksData, setBookmarksData] = useState(DEMO_BOOKMARKS_DATA);
  const [isLoading, setIsLoading] = useState(false);

  // 获取当前网站的基础 URL
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000");

  // Demo模式中的删除操作 - 使用本地状态
  const handleDeleteBookmark = useCallback(async (uuid: string) => {
    setBookmarksData({
      ...bookmarksData,
      bookmarks: bookmarksData.bookmarks.filter((b) => b.uuid !== uuid),
    });
  }, [bookmarksData]);

  // Demo模式中的更新操作 - 使用本地状态
  const handleUpdateBookmark = useCallback(async (updatedBookmark: BookmarkInstance) => {
    const updatedBookmarks = bookmarksData.bookmarks.map((b) =>
      b.uuid === updatedBookmark.uuid ? updatedBookmark : b
    );

    setBookmarksData({
      ...bookmarksData,
      bookmarks: updatedBookmarks,
    });
  }, [bookmarksData]);

  // Demo模式中的添加操作 - 使用本地状态
  const handleAddBookmark = useCallback(async (newBookmark: BookmarkInstance) => {
    setBookmarksData({
      ...bookmarksData,
      bookmarks: [...bookmarksData.bookmarks, newBookmark],
    });
  }, [bookmarksData]);

  return (
    <BookmarksUI
      mark="demo"
      bookmarksData={bookmarksData}
      isLoading={isLoading}
      isDemo={true}
      onDeleteBookmark={handleDeleteBookmark}
      onUpdateBookmark={handleUpdateBookmark}
      onAddBookmark={handleAddBookmark}
      baseUrl={baseUrl}
    />
  );
} 