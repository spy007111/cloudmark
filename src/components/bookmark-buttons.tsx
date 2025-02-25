interface BookmarkButtonsProps {
  mark: string;
  bookmarkletCode: string;
  baseUrl: string;
}

export function BookmarkButtons({
  mark,
  bookmarkletCode,
  baseUrl,
}: BookmarkButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <a
        href="#"
        draggable={true}
        ref={(node) => {
          if (node) {
            node.setAttribute("href", bookmarkletCode);
          }
        }}
        onClick={(e) => e.preventDefault()}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 select-all cursor-move"
      >
        保存到 {mark}
      </a>
      <a
        href={`${baseUrl}/bookmarks?mark=${mark}`}
        draggable={true}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 select-all cursor-move"
        suppressHydrationWarning
      >
        打开 {mark}
      </a>
    </div>
  );
}
