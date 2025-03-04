import { BookmarkPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect } from "react";

interface BookmarkletButtonProps {
  mark: string;
  baseUrl: string;
}

export function BookmarkletButton({ mark, baseUrl }: BookmarkletButtonProps) {
  const t = useTranslations("BookmarksPage");
  const [bookmarkletCode, setBookmarkletCode] = useState("");

  const generateBookmarkletCode = useCallback(() => {
    const code = `javascript:(function(){let m='${mark}',u=encodeURIComponent(location.href),t=encodeURIComponent(document.title);window.open('${baseUrl}/api/add?mark='+m+'&title='+t+'&url='+u, '_blank').focus()})()`;
    setBookmarkletCode(code);
  }, [mark, baseUrl]);

  useEffect(() => {
    generateBookmarkletCode();
  }, [generateBookmarkletCode]);

  return (
    <div className=" hover-scale">
      <a
        href="#"
        draggable={true}
        ref={(node) => {
          if (node) {
            node.setAttribute("href", bookmarkletCode);
          }
        }}
        onClick={(e) => e.preventDefault()}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 text-foreground h-9 px-4 py-2 select-all cursor-move shadow-sm hover:shadow-md"
        title={t("bookmarkletTip")}
      >
        <BookmarkPlus className="h-4 w-4 mr-2 text-blue-500" />
        {t("saveButton", { mark })}
      </a>
    </div>
  );
}
