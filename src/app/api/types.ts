export interface BookmarkInstance {
  url: string;
  title: string;
  favicon: string;
  createdAt: string;
  modifiedAt: string;
  category: string;
}

export interface BookmarksData {
  mark: string;
  categories: string[];
  bookmarks: BookmarkInstance[];
}

export const createDefaultBookmarksData = (mark: string): BookmarksData => ({
  mark,
  categories: [],
  bookmarks: [
    {
      url: "https://example.com",
      title: "Example",
      favicon: "https://example.com/favicon.ico",
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      category: "Uncategorized",
    },
  ],
});
