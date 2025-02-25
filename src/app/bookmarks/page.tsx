"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BookmarkInstance, BookmarksData } from "@/app/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Grid2X2,
  LayoutList,
  Plus,
  Search,
  ExternalLink,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

export default function BookmarksPage() {
  const searchParams = useSearchParams();
  const markId = searchParams.get("id") || "default";

  const [bookmarksData, setBookmarksData] = useState<BookmarksData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filteredBookmarks, setFilteredBookmarks] = useState<
    BookmarkInstance[]
  >([]);

  // 编辑状态
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentBookmark, setCurrentBookmark] =
    useState<BookmarkInstance | null>(null);
  const [formData, setFormData] = useState<Partial<BookmarkInstance>>({
    title: "",
    url: "",
    favicon: "",
    category: "",
  });

  // 获取书签数据
  useEffect(() => {
    async function fetchBookmarks() {
      setLoading(true);
      try {
        const response = await fetch(`/api/bookmarks/${markId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json<{ bookmarksdata: BookmarksData }>();
        setBookmarksData(data.bookmarksdata);
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
        setError("无法加载书签数据。请稍后重试。");
      } finally {
        setLoading(false);
      }
    }

    fetchBookmarks();
  }, [markId]);

  // 筛选书签
  useEffect(() => {
    if (!bookmarksData) return;

    let filtered = [...bookmarksData.bookmarks];

    // 按分类筛选
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (bookmark) => bookmark.category === selectedCategory
      );
    }

    // 按搜索词筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (bookmark) =>
          bookmark.title.toLowerCase().includes(term) ||
          bookmark.url.toLowerCase().includes(term)
      );
    }

    setFilteredBookmarks(filtered);
  }, [bookmarksData, selectedCategory, searchTerm]);

  // 处理添加书签
  const handleAddBookmark = async () => {
    if (!formData.url || !formData.title) return;

    try {
      const newBookmark: BookmarkInstance = {
        url: formData.url || "",
        title: formData.title || "",
        favicon: formData.favicon || "",
        category: formData.category || "未分类",
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      };

      // 如果没有提供favicon，尝试从URL生成
      if (!newBookmark.favicon) {
        try {
          const url = new URL(newBookmark.url);
          newBookmark.favicon = `${url.protocol}//${url.hostname}/favicon.ico`;
        } catch {
          newBookmark.favicon = "";
        }
      }

      const response = await fetch(`/api/bookmarks/${markId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBookmark),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // 刷新书签数据
      const refreshResponse = await fetch(`/api/bookmarks/${markId}`);
      const data = await refreshResponse.json<{
        bookmarksdata: BookmarksData;
      }>();
      setBookmarksData(data.bookmarksdata);
      setIsAddDialogOpen(false);
      resetFormData();
    } catch (err) {
      console.error("Failed to add bookmark:", err);
      setError("添加书签失败。请稍后重试。");
    }
  };

  // 处理编辑书签
  const handleEditBookmark = async () => {
    if (!currentBookmark || !formData.title) return;

    try {
      const updatedBookmark: BookmarkInstance = {
        ...currentBookmark,
        title: formData.title || currentBookmark.title,
        url: formData.url || currentBookmark.url,
        favicon: formData.favicon || currentBookmark.favicon,
        category: formData.category || currentBookmark.category,
        modifiedAt: new Date().toISOString(),
      };

      const response = await fetch(`/api/bookmarks/${markId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBookmark),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // 刷新书签数据
      const refreshResponse = await fetch(`/api/bookmarks/${markId}`);
      const data = await refreshResponse.json<{
        bookmarksdata: BookmarksData;
      }>();
      setBookmarksData(data.bookmarksdata);
      setIsEditDialogOpen(false);
      resetFormData();
    } catch (err) {
      console.error("Failed to update bookmark:", err);
      setError("更新书签失败。请稍后重试。");
    }
  };

  // 处理删除书签
  const handleDeleteBookmark = async () => {
    if (!currentBookmark) return;

    try {
      const response = await fetch(`/api/bookmarks/${markId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentBookmark),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // 刷新书签数据
      const refreshResponse = await fetch(`/api/bookmarks/${markId}`);
      const data = await refreshResponse.json<{
        bookmarksdata: BookmarksData;
      }>();
      setBookmarksData(data.bookmarksdata);
      setIsDeleteDialogOpen(false);
      setCurrentBookmark(null);
    } catch (err) {
      console.error("Failed to delete bookmark:", err);
      setError("删除书签失败。请稍后重试。");
    }
  };

  // 打开编辑对话框
  const openEditDialog = (bookmark: BookmarkInstance) => {
    setCurrentBookmark(bookmark);
    setFormData({
      title: bookmark.title,
      url: bookmark.url,
      favicon: bookmark.favicon,
      category: bookmark.category,
    });
    setIsEditDialogOpen(true);
  };

  // 打开删除对话框
  const openDeleteDialog = (bookmark: BookmarkInstance) => {
    setCurrentBookmark(bookmark);
    setIsDeleteDialogOpen(true);
  };

  // 重置表单数据
  const resetFormData = () => {
    setFormData({
      title: "",
      url: "",
      favicon: "",
      category: "",
    });
    setCurrentBookmark(null);
  };

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">正在加载书签...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h2 className="text-lg font-semibold">出错了！</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col space-y-6">
        {/* 标题栏 */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">我的书签</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                添加书签
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加新书签</DialogTitle>
                <DialogDescription>
                  输入书签信息以添加到您的收藏中。
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    标题
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="书签标题"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="url" className="text-right">
                    URL
                  </Label>
                  <Input
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="https://example.com"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="favicon" className="text-right">
                    图标URL
                  </Label>
                  <Input
                    id="favicon"
                    name="favicon"
                    value={formData.favicon}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    分类
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="选择一个分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="未分类">未分类</SelectItem>
                      {bookmarksData?.categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  取消
                </Button>
                <Button onClick={handleAddBookmark}>保存</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* 搜索和筛选 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索书签..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有分类</SelectItem>
              {bookmarksData?.categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode("list")}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 书签内容 */}
        <Tabs defaultValue="all" className="w-full">
          <TabsContent value="all" className="mt-0">
            {filteredBookmarks.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">没有找到书签</h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedCategory !== "all"
                    ? "尝试更改搜索条件或分类筛选"
                    : '点击"添加书签"按钮开始收集您的书签'}
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBookmarks.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.url}
                    bookmark={bookmark}
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredBookmarks.map((bookmark) => (
                  <BookmarkListItem
                    key={bookmark.url}
                    bookmark={bookmark}
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* 编辑对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑书签</DialogTitle>
            <DialogDescription>修改您的书签信息。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                标题
              </Label>
              <Input
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="书签标题"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-url" className="text-right">
                URL
              </Label>
              <Input
                id="edit-url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="https://example.com"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-favicon" className="text-right">
                图标URL
              </Label>
              <Input
                id="edit-favicon"
                name="favicon"
                value={formData.favicon}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="https://example.com/favicon.ico"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                分类
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择一个分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="未分类">未分类</SelectItem>
                  {bookmarksData?.categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              取消
            </Button>
            <Button onClick={handleEditBookmark}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>您确定要删除这个书签吗？</AlertDialogTitle>
            <AlertDialogDescription>
              这个操作不可撤销。这将永久删除您的书签
              {currentBookmark && (
                <strong className="font-medium">
                  {" "}
                  "{currentBookmark.title}"
                </strong>
              )}
              。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBookmark}
              className="bg-red-500 hover:bg-red-600"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// 书签卡片组件
function BookmarkCard({
  bookmark,
  onEdit,
  onDelete,
}: {
  bookmark: BookmarkInstance;
  onEdit: (bookmark: BookmarkInstance) => void;
  onDelete: (bookmark: BookmarkInstance) => void;
}) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-3">
          {bookmark.favicon && (
            <div className="flex-shrink-0 h-8 w-8 rounded overflow-hidden bg-white shadow-sm border">
              <img
                src={bookmark.favicon}
                alt=""
                className="h-full w-full object-contain"
                onError={(e) => {
                  // 图标加载失败时隐藏
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
          <div className="flex-1">
            <CardTitle className="text-base truncate">
              {bookmark.title}
            </CardTitle>
            <CardDescription className="truncate text-xs">
              {bookmark.url}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-2 flex-1">
        <div className="mt-2">
          <Badge variant="secondary">{bookmark.category}</Badge>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          添加时间: {format(new Date(bookmark.createdAt), "yyyy-MM-dd")}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between border-t">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          访问
          <ExternalLink className="ml-1 h-3 w-3" />
        </a>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(bookmark)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(bookmark)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

// 书签列表项组件
function BookmarkListItem({
  bookmark,
  onEdit,
  onDelete,
}: {
  bookmark: BookmarkInstance;
  onEdit: (bookmark: BookmarkInstance) => void;
  onDelete: (bookmark: BookmarkInstance) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/40 transition-colors">
      <div className="flex items-center space-x-3">
        {bookmark.favicon && (
          <div className="flex-shrink-0 h-6 w-6 rounded overflow-hidden bg-white shadow-sm border">
            <img
              src={bookmark.favicon}
              alt=""
              className="h-full w-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{bookmark.title}</h3>
          <p className="text-xs text-muted-foreground truncate">
            {bookmark.url}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Badge variant="secondary" className="mr-2">
          {bookmark.category}
        </Badge>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(bookmark)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDelete(bookmark)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
