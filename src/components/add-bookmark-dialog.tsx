"use client";

import type React from "react";

import { useState } from "react";
import type { BookmarkInstance } from "@/lib/types";
import { putBookmarkData } from "@/lib/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Link, FileText, Tag, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface AddBookmarkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mark: string;
  categories: string[];
  onBookmarkAdded: (bookmark: BookmarkInstance) => void;
  isDemo?: boolean;
}

export function AddBookmarkDialog({
  open,
  onOpenChange,
  mark,
  categories,
  onBookmarkAdded,
  isDemo = false,
}: AddBookmarkDialogProps) {
  const t = useTranslations("Components.BookmarkDialog");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0] || "");
  const [newCategory, setNewCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url) {
      setError(t("errors.urlRequired"));
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (e) {
      setError(t("errors.invalidUrl"));
      return;
    }

    const selectedCategory = isCustomCategory ? newCategory : category;

    if (isCustomCategory && !newCategory) {
      setError(t("errors.categoryRequired"));
      return;
    }

    setIsSubmitting(true);

    try {
      // Demo模式下，直接创建新书签对象而不调用API
      if (isDemo) {
        const newBookmark: BookmarkInstance = {
          url,
          title: title || new URL(url).hostname,
          favicon: `https://${new URL(url).hostname}/favicon.ico`,
          category: selectedCategory,
          description: description,
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
        };

        onBookmarkAdded(newBookmark);
      } else {
        // 正常模式，调用API
        const formData = new FormData();
        formData.append("mark", mark);
        formData.append("url", url);
        formData.append("title", title || new URL(url).hostname);
        formData.append("category", selectedCategory);
        formData.append("description", description);

        const newBookmark = await putBookmarkData(formData);
        onBookmarkAdded(newBookmark);
      }

      // 重置表单
      setUrl("");
      setTitle("");
      setDescription("");
      setCategory(categories[0] || "");
      setNewCategory("");
      setIsCustomCategory(false);

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add bookmark:", error);
      setError(t("errors.addFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border border-blue-500/20 bg-card/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <span className="bg-blue-500/10 p-1.5 rounded-md">
              <Plus className="h-4 w-4 text-blue-500" />
            </span>
            {t("addTitle")}
          </DialogTitle>
          <DialogDescription>{t("addDescription", { mark })}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="url" className="flex items-center gap-1.5">
              <Link className="h-3.5 w-3.5 text-blue-500" />
              {t("url")}
            </Label>
            <Input
              id="url"
              placeholder={t("urlPlaceholder")}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="border-blue-500/20 focus:border-blue-500/40 bg-blue-500/5 focus:ring-blue-500/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-indigo-500" />
              {t("title")}
            </Label>
            <Input
              id="title"
              placeholder={t("titlePlaceholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-indigo-500/20 focus:border-indigo-500/40 bg-indigo-500/5 focus:ring-indigo-500/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-purple-500" />
              {t("description")}
            </Label>
            <Textarea
              id="description"
              placeholder={t("descriptionPlaceholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="border-purple-500/20 focus:border-purple-500/40 bg-purple-500/5 focus:ring-purple-500/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-green-500" />
              {t("category")}
            </Label>
            {categories.length > 0 && !isCustomCategory ? (
              <div className="flex space-x-2">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full border-green-500/20 focus:border-green-500/40 bg-green-500/5 focus:ring-green-500/10">
                    <SelectValue placeholder={t("categoryPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCustomCategory(true)}
                    className="border-green-500/20 hover:border-green-500/40 bg-green-500/5 hover:bg-green-500/10"
                  >
                    {t("newCategory")}
                  </Button>
                </motion.div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Input
                  id="newCategory"
                  placeholder={t("newCategoryPlaceholder")}
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="border-green-500/20 focus:border-green-500/40 bg-green-500/5 focus:ring-green-500/10"
                />
                {categories.length > 0 && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCustomCategory(false)}
                      className="border-green-500/20 hover:border-green-500/40 bg-green-500/5 hover:bg-green-500/10"
                    >
                      {t("existingCategory")}
                    </Button>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="text-sm font-medium text-destructive bg-destructive/10 p-2 rounded-md">
              {error}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-gray-500/20 hover:border-gray-500/40 bg-gray-500/5 hover:bg-gray-500/10"
              >
                {t("cancel")}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("addButton")}
              </Button>
            </motion.div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
