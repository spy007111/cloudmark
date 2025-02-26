"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import type { BookmarkInstance, BookmarksData } from "@/lib/types";
import { getBookmarkData, deleteBookmarkData } from "@/lib/actions";
import { BookmarkCard } from "@/components/bookmark-card";
import { CategoryFilter } from "@/components/category-filter";
import { AddBookmarkDialog } from "@/components/add-bookmark-dialog";
import { EditBookmarkDialog } from "@/components/edit-bookmark-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Bookmark, Search, BookmarkPlus } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/toast-provider";
import { DEMO_BOOKMARKS_DATA } from "./demo_data";

export default function BookmarksPage() {
  const params = useParams<{ mark: string }>();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const mark = params.mark;
  const t = useTranslations("BookmarksPage");
  const tButtons = useTranslations("Components.BookmarkButtons");
  const tNotifications = useTranslations("Notifications");

  const [bookmarksData, setBookmarksData] = useState<BookmarksData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBookmark, setSelectedBookmark] =
    useState<BookmarkInstance | null>(null);
  const [bookmarkletCode, setBookmarkletCode] = useState("");

  // 使用 ref 跟踪是否已经显示过通知
  const toastShownRef = useRef(false);

  // 获取当前网站的基础 URL
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000");

  // 生成bookmarklet代码
  const generateBookmarkletCode = useCallback(() => {
    const code = `javascript:(function(){let m='${mark}',u=encodeURIComponent(location.href),t=encodeURIComponent(document.title);window.open('${baseUrl}/api/add?mark='+m+'&title='+t+'&url='+u, '_blank').focus()})()`;
    setBookmarkletCode(code);
  }, [mark, baseUrl]);

  // 动画变体
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    // 处理 URL 参数中的状态和消息
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // 如果是demo模式，使用预设的演示数据
      if (mark === "demo") {
        setBookmarksData(DEMO_BOOKMARKS_DATA);
        setIsLoading(false);
        return;
      }

      // 否则正常获取数据
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
    generateBookmarkletCode();
  }, [mark, generateBookmarkletCode]);

  const handleDeleteBookmark = async (url: string) => {
    if (!bookmarksData) return;

    // 如果是demo模式，只更新本地状态
    if (mark === "demo") {
      setBookmarksData({
        ...bookmarksData,
        bookmarks: bookmarksData.bookmarks.filter((b) => b.url !== url),
        categories: [
          ...new Set(
            bookmarksData.bookmarks
              .filter((b) => b.url !== url)
              .map((b) => b.category),
          ),
        ],
      });
      return;
    }

    const formData = new FormData();
    formData.append("mark", mark);
    formData.append("url", url);

    try {
      await deleteBookmarkData(formData);

      // Update local state
      setBookmarksData({
        ...bookmarksData,
        bookmarks: bookmarksData.bookmarks.filter((b) => b.url !== url),
        categories: [
          ...new Set(
            bookmarksData.bookmarks
              .filter((b) => b.url !== url)
              .map((b) => b.category),
          ),
        ],
      });
    } catch (error) {
      console.error("Failed to delete bookmark:", error);
    }
  };

  const handleEditBookmark = (bookmark: BookmarkInstance) => {
    setSelectedBookmark(bookmark);
    setIsEditDialogOpen(true);
  };

  const handleBookmarkUpdated = (updatedBookmark: BookmarkInstance) => {
    if (!bookmarksData) return;

    // Update local state
    const updatedBookmarks = bookmarksData.bookmarks.map((b) =>
      b.url === updatedBookmark.url ? updatedBookmark : b,
    );

    setBookmarksData({
      ...bookmarksData,
      bookmarks: updatedBookmarks,
      categories: [...new Set(updatedBookmarks.map((b) => b.category))],
    });
  };

  const handleBookmarkAdded = (newBookmark: BookmarkInstance) => {
    if (bookmarksData) {
      setBookmarksData({
        ...bookmarksData,
        bookmarks: [...bookmarksData.bookmarks, newBookmark],
        categories: [
          ...new Set([...bookmarksData.categories, newBookmark.category]),
        ],
      });
    }
  };

  const filteredBookmarks = bookmarksData?.bookmarks.filter(
    (bookmark) => !selectedCategory || bookmark.category === selectedCategory,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Bookmark className="h-6 w-6 text-primary/70" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container relative">
      {/* 装饰背景元素 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-3xl transform -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-purple-500/10 rounded-full blur-3xl transform translate-y-12 -translate-x-12" />
        <div className="absolute bottom-1/3 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="py-12 lg:py-16">
        {/* 演示模式提示条 */}
        {mark === "demo" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 rounded-lg border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm p-4 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex items-center gap-2 text-amber-600 font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M12 9v4"></path>
                  <path d="M12 16h.01"></path>
                  <path d="M3.8 9.7a8 8 0 0 0 0 4.6"></path>
                  <path d="M20.2 9.7a8 8 0 0 1 0 4.6"></path>
                  <path d="M8 3.6a8 8 0 0 1 8 0"></path>
                  <path d="M8 20.4a8 8 0 0 0 8 0"></path>
                  <path d="m18.7 14.4-.9-.1"></path>
                  <path d="m6.2 9.7-.9.1"></path>
                  <path d="m14.4 5.3-.1.9"></path>
                  <path d="m9.7 17.8-.1.9"></path>
                  <path d="m14.4 18.7.1.9"></path>
                  <path d="m9.7 5.3-.1-.9"></path>
                  <path d="m17.8 9.7.9-.1"></path>
                  <path d="m5.3 14.4.9.1"></path>
                </svg>
                <span>{t("demoMode")}</span>
              </div>
              <p className="text-muted-foreground text-sm flex-1">
                {t("demoDescription")}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-amber-500/20 hover:border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 text-amber-700"
                onClick={() => (window.location.href = "/doc")}
              >
                {t("createOwn")}
              </Button>
            </div>
          </motion.div>
        )}

        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6"
        >
          <div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-2 mb-2"
            >
              <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
                {t("title")}
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-muted-foreground"
            >
              {t("collection", { mark })}
            </motion.p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md"
              >
                <PlusCircle className="h-4 w-4" />
                {t("addBookmark")}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="#"
                draggable={true}
                ref={(node) => {
                  if (node) {
                    node.setAttribute("href", bookmarkletCode);
                  }
                }}
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 text-foreground h-10 px-4 py-2 select-all cursor-move shadow-sm hover:shadow-md"
                title={t("bookmarkletTip")}
              >
                <BookmarkPlus className="h-4 w-4 mr-2 text-blue-500" />
                {tButtons("saveButton", { mark })}
              </a>
              <div className="hidden sm:flex items-center mt-1 text-xs text-muted-foreground">
                <span className="animate-pulse">↑</span>
                <span className="ml-1">{tButtons("dragTip")}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 分类筛选 */}
        {bookmarksData && bookmarksData.categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mb-8"
          >
            <CategoryFilter
              categories={bookmarksData.categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </motion.div>
        )}

        {/* 书签列表 */}
        {filteredBookmarks && filteredBookmarks.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredBookmarks.map((bookmark) => (
              <motion.div key={bookmark.url} variants={item}>
                <BookmarkCard
                  bookmark={bookmark}
                  onDelete={() => handleDeleteBookmark(bookmark.url)}
                  onEdit={() => handleEditBookmark(bookmark)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center py-16 px-4"
          >
            <div className="max-w-md mx-auto">
              <div className="bg-card/50 backdrop-blur-sm border border-border/60 rounded-xl p-8 shadow-sm">
                <div className="flex justify-center mb-4">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-md"></div>
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-muted-foreground text-lg mb-6">
                  {t("noBookmarks")}
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    className="border-blue-500/20 hover:border-blue-500/40 bg-blue-500/5"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t("addFirstBookmark")}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* 对话框 */}
      <AddBookmarkDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        mark={mark}
        categories={bookmarksData?.categories || []}
        onBookmarkAdded={handleBookmarkAdded}
        isDemo={mark === "demo"}
      />

      {selectedBookmark && (
        <EditBookmarkDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          mark={mark}
          bookmark={selectedBookmark}
          categories={bookmarksData?.categories || []}
          onBookmarkUpdated={handleBookmarkUpdated}
          isDemo={mark === "demo"}
        />
      )}
    </div>
  );
}
