"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import type { BookmarkInstance, BookmarksData } from "@/lib/types"
import { getBookmarkData, deleteBookmarkData } from "@/lib/actions"
import { BookmarkCard } from "@/components/bookmark-card"
import { CategoryFilter } from "@/components/category-filter"
import { AddBookmarkDialog } from "@/components/add-bookmark-dialog"
import { EditBookmarkDialog } from "@/components/edit-bookmark-dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export const runtime = 'edge'

export default function BookmarksPage() {
  const params = useParams()
  const mark = params.mark as string

  const [bookmarksData, setBookmarksData] = useState<BookmarksData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedBookmark, setSelectedBookmark] = useState<BookmarkInstance | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const formData = new FormData()
      formData.append("mark", mark)

      try {
        const data = await getBookmarkData(formData)
        setBookmarksData(data)
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [mark])

  const handleDeleteBookmark = async (url: string) => {
    if (!bookmarksData) return

    const formData = new FormData()
    formData.append("mark", mark)
    formData.append("url", url)

    try {
      await deleteBookmarkData(formData)

      // Update local state
      setBookmarksData({
        ...bookmarksData,
        bookmarks: bookmarksData.bookmarks.filter((b) => b.url !== url),
        categories: [...new Set(bookmarksData.bookmarks.filter((b) => b.url !== url).map((b) => b.category))],
      })
    } catch (error) {
      console.error("Failed to delete bookmark:", error)
    }
  }

  const handleEditBookmark = (bookmark: BookmarkInstance) => {
    setSelectedBookmark(bookmark)
    setIsEditDialogOpen(true)
  }

  const handleBookmarkUpdated = (updatedBookmark: BookmarkInstance) => {
    if (!bookmarksData) return

    // Update local state
    const updatedBookmarks = bookmarksData.bookmarks.map((b) => (b.url === updatedBookmark.url ? updatedBookmark : b))

    setBookmarksData({
      ...bookmarksData,
      bookmarks: updatedBookmarks,
      categories: [...new Set(updatedBookmarks.map((b) => b.category))],
    })
  }

  const filteredBookmarks = bookmarksData?.bookmarks.filter(
    (bookmark) => !selectedCategory || bookmark.category === selectedCategory,
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookmarks</h1>
          <p className="text-muted-foreground mt-1">Collection: {mark}</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Bookmark
        </Button>
      </div>

      {bookmarksData && bookmarksData.categories.length > 0 && (
        <div className="mb-6">
          <CategoryFilter
            categories={bookmarksData.categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      )}

      {filteredBookmarks && filteredBookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.url}
              bookmark={bookmark}
              onDelete={() => handleDeleteBookmark(bookmark.url)}
              onEdit={() => handleEditBookmark(bookmark)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No bookmarks found.</p>
          <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
            Add your first bookmark
          </Button>
        </div>
      )}

      <AddBookmarkDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        mark={mark}
        categories={bookmarksData?.categories || []}
        onBookmarkAdded={(newBookmark) => {
          if (bookmarksData) {
            setBookmarksData({
              ...bookmarksData,
              bookmarks: [...bookmarksData.bookmarks, newBookmark],
              categories: [...new Set([...bookmarksData.categories, newBookmark.category])],
            })
          }
        }}
      />

      {selectedBookmark && (
        <EditBookmarkDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          mark={mark}
          bookmark={selectedBookmark}
          categories={bookmarksData?.categories || []}
          onBookmarkUpdated={handleBookmarkUpdated}
        />
      )}
    </div>
  )
}

