"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { BookmarkInstance, BookmarksData } from "@/lib/types";
import { BookmarkCard } from "@/components/bookmark-card";
import { CategoryFilter } from "@/components/category-filter";
import { AddBookmarkDialog } from "@/components/add-bookmark-dialog";
import { EditBookmarkDialog } from "@/components/edit-bookmark-dialog";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Bookmark,
  Search,
  BookmarkPlus,
  LayoutGrid,
  Layers,
  Clock,
  AlignLeft,
  Tag,
  ChevronDown,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/toast-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 从书签列表中提取所有唯一分类
const getCategories = (bookmarks: BookmarkInstance[]): string[] => {
  return [...new Set(bookmarks.map((bookmark) => bookmark.category))].sort();
};

// 排序类型
type SortOption = "time" | "category" | "title";

export interface BookmarksUIProps {
  mark: string;
  bookmarksData: BookmarksData | null;
  isLoading: boolean;
  isDemo: boolean;
  onDeleteBookmark: (uuid: string) => Promise<void>;
  onUpdateBookmark: (bookmark: BookmarkInstance) => Promise<void>;
  onAddBookmark: (bookmark: BookmarkInstance) => Promise<void>;
  baseUrl: string;
}

export function BookmarksUI({
  mark,
  bookmarksData,
  isLoading,
  isDemo,
  onDeleteBookmark,
  onUpdateBookmark,
  onAddBookmark,
  baseUrl,
}: BookmarksUIProps) {
  const { showToast } = useToast();
  const t = useTranslations("BookmarksPage");
  const tButtons = useTranslations("Components.BookmarkButtons");
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState<BookmarkInstance | null>(null);
  const [bookmarkletCode, setBookmarkletCode] = useState("");

  // 用户界面偏好状态
  const [layoutMode, setLayoutMode] = useState<"grid" | "category">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("time");

  // 使用 ref 跟踪是否已经从localStorage加载过偏好设置
  const preferencesLoadedRef = useRef(false);

  // 保存用户偏好到本地存储
  const savePreferences = useCallback(() => {
    if (typeof window !== "undefined") {
      const preferences = {
        layoutMode,
        sortBy,
        selectedCategory,
      };
      localStorage.setItem(
        `cloudmark_prefs_${mark}`,
        JSON.stringify(preferences),
      );
    }
  }, [layoutMode, sortBy, selectedCategory, mark]);

  // 加载用户偏好
  const loadPreferences = useCallback(() => {
    if (typeof window !== "undefined" && !preferencesLoadedRef.current) {
      try {
        const savedPrefs = localStorage.getItem(`cloudmark_prefs_${mark}`);
        if (savedPrefs) {
          const preferences = JSON.parse(savedPrefs);
          setLayoutMode(preferences.layoutMode || "grid");
          setSortBy(preferences.sortBy || "time");
          setSelectedCategory(preferences.selectedCategory || null);
        }
        preferencesLoadedRef.current = true;
      } catch (error) {
        console.error("Failed to load preferences:", error);
      }
    }
  }, [mark]);

  // 生成bookmarklet代码
  const generateBookmarkletCode = useCallback(() => {
    const code = `javascript:(function(){let m='${mark}',u=encodeURIComponent(location.href),t=encodeURIComponent(document.title);window.open('${baseUrl}/api/add?mark='+m+'&title='+t+'&url='+u, '_blank').focus()})()`;
    setBookmarkletCode(code);
  }, [mark, baseUrl]);

  // 处理排序逻辑
  const getSortedBookmarks = useCallback(
    (bookmarks: BookmarkInstance[]) => {
      if (!bookmarks) return [];

      // 先筛选分类
      const filtered = !selectedCategory
        ? [...bookmarks]
        : bookmarks.filter((b) => b.category === selectedCategory);

      // 根据排序选项进行排序
      return filtered.sort((a, b) => {
        switch (sortBy) {
          case "time":
            // 按创建时间降序排列（新的在前）
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "title":
            // 按标题字母升序排列
            return a.title.localeCompare(b.title);
          case "category":
            // 先按分类名称，然后按标题排列
            const catCompare = a.category.localeCompare(b.category);
            return catCompare !== 0
              ? catCompare
              : a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
    },
    [selectedCategory, sortBy],
  );

  // 使用useMemo计算过滤后的书签列表，避免不必要的重新计算
  const filteredBookmarks = useMemo(() => {
    return bookmarksData?.bookmarks.filter(
      (bookmark) => !selectedCategory || bookmark.category === selectedCategory,
    );
  }, [bookmarksData, selectedCategory]);

  // 使用useMemo计算分类列表，避免不必要的重新计算
  const categories = useMemo(() => {
    return bookmarksData ? getCategories(bookmarksData.bookmarks) : [];
  }, [bookmarksData]);

  // 当用户偏好变化时保存到本地存储
  useEffect(() => {
    // 只有在非加载状态下才保存偏好
    if (!isLoading && preferencesLoadedRef.current) {
      savePreferences();
    }
  }, [layoutMode, sortBy, selectedCategory, savePreferences, isLoading]);

  // 组件初始化时加载用户偏好和生成书签代码
  useEffect(() => {
    loadPreferences();
    generateBookmarkletCode();
  }, [loadPreferences, generateBookmarkletCode]);

  const handleEditBookmark = useCallback((bookmark: BookmarkInstance) => {
    setSelectedBookmark(bookmark);
    setIsEditDialogOpen(true);
  }, []);

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
        {isDemo && (
          <div className="demo-banner mb-8 rounded-lg border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm p-4 shadow-sm">
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
          </div>
        )}

        {/* 标题区域 */}
        <div className="title-area flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <div className="title-text flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
                {t("title")}
              </h1>
            </div>
            <p className="subtitle-text text-muted-foreground">
              {t("collection", { mark })}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="button-container hover-scale">
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md"
              >
                <PlusCircle className="h-4 w-4" />
                {t("addBookmark")}
              </Button>
            </div>

            <div className="bookmarklet-button hover-scale">
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
            </div>
          </div>
        </div>

        {/* 布局切换按钮和排序下拉菜单 */}
        {bookmarksData && bookmarksData.bookmarks.length > 0 && (
          <div className="controls-area flex justify-between items-center mb-4">
            {/* 排序下拉菜单 */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    {sortBy === "time" && <Clock className="h-4 w-4" />}
                    {sortBy === "title" && <AlignLeft className="h-4 w-4" />}
                    {sortBy === "category" && <Tag className="h-4 w-4" />}
                    {t("sortBy")}: {t(`sortOptions.${sortBy}`)}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setSortBy("time")}>
                    <Clock className="h-4 w-4 mr-2" />
                    {t("sortOptions.time")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("title")}>
                    <AlignLeft className="h-4 w-4 mr-2" />
                    {t("sortOptions.title")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("category")}>
                    <Tag className="h-4 w-4 mr-2" />
                    {t("sortOptions.category")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* 布局切换按钮 */}
            <div className="bg-card/30 backdrop-blur-sm rounded-lg border border-border/50 p-1 flex gap-1 shadow-sm">
              <Button
                variant={layoutMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLayoutMode("grid")}
                className={layoutMode === "grid" ? "bg-primary/90" : ""}
                title={t("gridView")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={layoutMode === "category" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLayoutMode("category")}
                className={layoutMode === "category" ? "bg-primary/90" : ""}
                title={t("categoryView")}
              >
                <Layers className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* 分类筛选 */}
        {bookmarksData &&
          bookmarksData.bookmarks.length > 0 &&
          layoutMode === "grid" && (
            <div className="filter-area mb-8">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>
          )}

        {/* 书签列表 */}
        {bookmarksData && bookmarksData.bookmarks.length > 0 ? (
          layoutMode === "grid" ? (
            // 网格布局视图
            <div className="grid-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {getSortedBookmarks(bookmarksData.bookmarks).map(
                (bookmark, index) => (
                  <div
                    key={bookmark.uuid}
                    className={`grid-item h-full w-full delay-${(index % 9) * 100}`}
                  >
                    <BookmarkCard
                      bookmark={bookmark}
                      onDelete={() => onDeleteBookmark(bookmark.uuid)}
                      onEdit={() => handleEditBookmark(bookmark)}
                    />
                  </div>
                ),
              )}
            </div>
          ) : (
            // 分类归纳视图
            <div className="stagger-container space-y-8">
              {categories.map((category, categoryIndex) => {
                // 如果有选中的分类，只显示该分类
                if (selectedCategory && category !== selectedCategory)
                  return null;

                const categoryBookmarks = getSortedBookmarks(
                  bookmarksData.bookmarks.filter(
                    (b) => b.category === category,
                  ),
                );

                if (categoryBookmarks.length === 0) return null;

                return (
                  <div
                    key={category}
                    className={`stagger-item delay-${categoryIndex * 100} overflow-hidden`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center px-3 py-1.5 bg-primary/10 text-primary rounded-lg">
                        <Layers className="h-4 w-4 mr-2 opacity-70" />
                        <h3 className="text-md font-medium">{category}</h3>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ({categoryBookmarks.length})
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {categoryBookmarks.map((bookmark, bookmarkIndex) => (
                        <div
                          key={bookmark.uuid}
                          className={`stagger-item delay-${(bookmarkIndex % 5) * 100 + 100}`}
                        >
                          <BookmarkCard
                            bookmark={bookmark}
                            onDelete={() => onDeleteBookmark(bookmark.uuid)}
                            onEdit={() => handleEditBookmark(bookmark)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <div className="empty-state text-center py-16 px-4">
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
                <div className="hover-scale">
                  <Button
                    variant="outline"
                    className="border-blue-500/20 hover:border-blue-500/40 bg-blue-500/5"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t("addFirstBookmark")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 对话框 */}
      <AddBookmarkDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        mark={mark}
        categories={categories}
        onBookmarkAdded={onAddBookmark}
        isDemo={isDemo}
      />

      {selectedBookmark && (
        <EditBookmarkDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          bookmark={selectedBookmark}
          categories={categories}
          onBookmarkUpdated={onUpdateBookmark}
          isDemo={isDemo}
        />
      )}
    </div>
  );
} 