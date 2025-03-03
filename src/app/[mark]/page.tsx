import { useTranslations } from "next-intl";
import "./page.css";
import { getCategories } from "@/lib/utils";
import { getBookmarkData } from "@/lib/actions";
import { DialogCreate } from "@/components/dialog-create";

interface BookmarksPageProps {
  params: Promise<{ mark: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function BookmarksPage({ params, searchParams }: BookmarksPageProps) {
  const { mark } = await params;
  const sp = await searchParams;
  const bookmarksData = await getBookmarkData({ mark });
  const categories = getCategories(bookmarksData);

  return (
    // <BookmarksUI
    //   mark={mark}
    //   bookmarksData={bookmarksData}
    //   isLoading={isLoading}
    //   isDemo={false}
    //   onDeleteBookmark={handleDeleteBookmark}
    //   onUpdateBookmark={handleUpdateBookmark}
    //   onAddBookmark={handleAddBookmark}
    //   baseUrl={getBaseUrl()}
    // />
    <div>
      <h1>Bookmarks</h1>
    </div>
  );
}
