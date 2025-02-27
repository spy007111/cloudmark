"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import type { BookmarkInstance, BookmarksData } from "@/lib/types";
import { getBookmarkData, deleteBookmarkData } from "@/lib/actions";
import { BookmarksUI } from "@/components/bookmarks-ui";
import { useToast } from "@/components/toast-provider";
import { useTranslations } from "next-intl";
import "./page.css";
import { getBaseUrl } from "@/lib/utils";

export default function BookmarksPage() {
  const params = useParams<{ mark: string }>();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const mark = params.mark;
  const tNotifications = useTranslations("Notifications");

  const [bookmarksData, setBookmarksData] = useState<BookmarksData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // 使用 ref 跟踪是否已经显示过通知
  const toastShownRef = useRef(false);

  // 正常模式删除书签 - 使用API请求
  const handleDeleteBookmark = useCallback(
    async (uuid: string) => {
      const formData = new FormData();
      formData.append("mark", mark);
      formData.append("uuid", uuid);

      try {
        await deleteBookmarkData(formData);

        // 调用API后，刷新书签数据
        await refreshBookmarks();
      } catch (error) {
        console.error("Failed to delete bookmark:", error);
      }
    },
    [mark]
  );

  // 正常模式更新书签 - 使用API请求
  const handleUpdateBookmark = useCallback(
    async (updatedBookmark: BookmarkInstance) => {
      // 刷新书签数据
      await refreshBookmarks();
    },
    []
  );

  // 正常模式添加书签 - 使用API请求
  const handleAddBookmark = useCallback(
    async (newBookmark: BookmarkInstance) => {
      // 刷新书签数据
      await refreshBookmarks();
    },
    []
  );

  // 刷新书签数据的通用函数
  const refreshBookmarks = async () => {
    const formData = new FormData();
    formData.append("mark", mark);

    try {
      const data = await getBookmarkData(formData);
      setBookmarksData(data);
    } catch (error) {
      console.error("Failed to refresh bookmarks:", error);
    }
  };

  // 处理URL参数中的消息
  useEffect(() => {
    const status = searchParams.get("status");
    const messageKey = searchParams.get("message");

    // 只有当状态和消息存在，且尚未显示过通知时，才显示通知
    if (status && messageKey && !toastShownRef.current) {
      try {
        // 标记已显示通知
        toastShownRef.current = true;

        // 根据状态显示不同类型的 Toast
        switch (status) {
          case "success":
            showToast({
              title: tNotifications("success"),
              description: tNotifications(messageKey),
              variant: "success",
            });
            break;
          case "error":
            showToast({
              title: tNotifications("error"),
              description: tNotifications(messageKey),
              variant: "error",
            });
            break;
          case "warning":
            showToast({
              title: tNotifications("warning"),
              description: tNotifications(messageKey),
              variant: "warning",
            });
            break;
          default:
            showToast({
              title: tNotifications("info"),
              description: tNotifications(messageKey),
              variant: "info",
            });
        }

        // 清除 URL 中的状态和消息参数
        const url = new URL(window.location.href);
        url.searchParams.delete("status");
        url.searchParams.delete("message");
        window.history.replaceState({}, "", url.toString());
      } catch (error) {
        console.error("Failed to process notification:", error);
      }
    }

    // 清理函数，在组件卸载时重置 toastShownRef
    return () => {
      toastShownRef.current = false;
    };
  }, [searchParams, showToast, tNotifications]);

  // 初始化时加载数据
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // 正常获取数据
      const formData = new FormData();
      formData.append("mark", mark);

      try {
        const data = await getBookmarkData(formData);
        setBookmarksData(data);
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [mark]);

  return (
    <BookmarksUI
      mark={mark}
      bookmarksData={bookmarksData}
      isLoading={isLoading}
      isDemo={false}
      onDeleteBookmark={handleDeleteBookmark}
      onUpdateBookmark={handleUpdateBookmark}
      onAddBookmark={handleAddBookmark}
      baseUrl={getBaseUrl()}
    />
  );
}
