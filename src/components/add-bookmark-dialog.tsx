"use client"

import type React from "react"

import { useState } from "react"
import type { BookmarkInstance } from "@/lib/types"
import { putBookmarkData } from "@/lib/actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface AddBookmarkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mark: string
  categories: string[]
  onBookmarkAdded: (bookmark: BookmarkInstance) => void
}

export function AddBookmarkDialog({ open, onOpenChange, mark, categories, onBookmarkAdded }: AddBookmarkDialogProps) {
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState(categories[0] || "")
  const [newCategory, setNewCategory] = useState("")
  const [isCustomCategory, setIsCustomCategory] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!url) {
      setError("URL is required")
      return
    }

    // Basic URL validation
    try {
      new URL(url)
    } catch (e) {
      setError("Please enter a valid URL")
      return
    }

    const selectedCategory = isCustomCategory ? newCategory : category

    if (isCustomCategory && !newCategory) {
      setError("Category name is required")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("mark", mark)
      formData.append("url", url)
      formData.append("title", title || new URL(url).hostname)
      formData.append("favicon", `https://www.google.com/s2/favicons?domain=${url}`)
      formData.append("category", selectedCategory)
      formData.append("description", description)

      await putBookmarkData(formData)

      const newBookmark: BookmarkInstance = {
        url,
        title: title || new URL(url).hostname,
        favicon: `https://www.google.com/s2/favicons?domain=${url}`,
        category: selectedCategory,
        description,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      }

      onBookmarkAdded(newBookmark)

      // Reset form
      setUrl("")
      setTitle("")
      setDescription("")
      setCategory(categories[0] || "")
      setNewCategory("")
      setIsCustomCategory(false)

      onOpenChange(false)
    } catch (error) {
      console.error("Failed to add bookmark:", error)
      setError("Failed to add bookmark. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Bookmark</DialogTitle>
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
            <Label htmlFor="title">Title (Optional)</Label>
            <Input id="title" placeholder="My Bookmark" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
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
                <Button type="button" variant="outline" onClick={() => setIsCustomCategory(true)}>
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
                  <Button type="button" variant="outline" onClick={() => setIsCustomCategory(false)}>
                    Existing
                  </Button>
                )}
              </div>
            )}
          </div>

          {error && <div className="text-sm font-medium text-destructive">{error}</div>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Bookmark
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

