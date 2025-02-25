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
import { Loader2 } from "lucide-react";

interface EditBookmarkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mark: string;
  bookmark: BookmarkInstance;
  categories: string[];
  onBookmarkUpdated: (updatedBookmark: BookmarkInstance) => void;
}

export function EditBookmarkDialog({
  open,
  onOpenChange,
  mark,
  bookmark,
  categories,
  onBookmarkUpdated,
}: EditBookmarkDialogProps) {
  const [url, setUrl] = useState(bookmark.url);
  const [title, setTitle] = useState(bookmark.title);
  const [category, setCategory] = useState(bookmark.category);
  const [description, setDescription] = useState(bookmark.description || "");
  const [newCategory, setNewCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url) {
      setError("URL is required");
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (e) {
      setError("Please enter a valid URL");
      return;
    }

    const selectedCategory = isCustomCategory ? newCategory : category;

    if (isCustomCategory && !newCategory) {
      setError("Category name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("mark", mark);
      formData.append("url", url);
      formData.append("title", title);
      formData.append("category", selectedCategory);
      formData.append("description", description);

      await putBookmarkData(formData);

      const updatedBookmark: BookmarkInstance = {
        ...bookmark,
        url,
        title,
        category: selectedCategory,
        description,
        modifiedAt: new Date().toISOString(),
      };

      onBookmarkUpdated(updatedBookmark);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update bookmark:", error);
      setError("Failed to update bookmark. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Bookmark</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="My Bookmark"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add a description for this bookmark"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            {categories.length > 0 && !isCustomCategory ? (
              <div className="flex space-x-2">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCustomCategory(true)}
                >
                  New
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Input
                  id="newCategory"
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                {categories.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCustomCategory(false)}
                  >
                    Existing
                  </Button>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="text-sm font-medium text-destructive">{error}</div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
