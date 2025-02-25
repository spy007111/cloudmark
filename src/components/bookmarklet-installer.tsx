"use client";

import { useEffect, useState, useCallback } from "react";
import { Bookmark, Copy, Check, Wand2, RefreshCcw } from "lucide-react";
import { MarkInput } from "@/components/mark-input";
import { BookmarkButtons } from "@/components/bookmark-buttons";
import styles from "./bookmarklet-installer.module.css";
import { Button } from "@/components/ui/button";

interface BookmarkletInstallerProps {
  mark?: string;
  onMarkChange?: (mark: string) => void;
}

export default function BookmarkletInstaller({
  mark: externalMark,
  onMarkChange: externalOnMarkChange,
}: BookmarkletInstallerProps) {
  const [localMark, setLocalMark] = useState("my-bookmark");
  const [bookmarkletCode, setBookmarkletCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // 使用外部或本地状态
  const mark = externalMark ?? localMark;
  const onMarkChange = useCallback(
    (newMark: string) => {
      if (externalOnMarkChange) {
        externalOnMarkChange(newMark);
      } else {
        setLocalMark(newMark);
      }
    },
    [externalOnMarkChange]
  );

  // 获取当前网站的基础 URL
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  // 生成bookmarklet代码
  const generateBookmarkletCode = useCallback(
    (markValue: string) => {
      const code = `javascript:(function(){let m='${markValue}',u=encodeURIComponent(location.href),t=encodeURIComponent(document.title),f=encodeURIComponent((document.querySelector('link[rel="icon"]')||document.querySelector('link[rel="shortcut icon"]')||{href:'/favicon.ico'}).href);location.href='${baseUrl}/add?mark='+m+'?title='+t+'?url='+u+'?favicon='+f})()`;
      setBookmarkletCode(code);
    },
    [baseUrl]
  );

  // 生成随机字符串
  const generateRandomMark = () => {
    setIsGenerating(true);
    const adjectives = [
      "happy",
      "clever",
      "bright",
      "swift",
      "calm",
      "wise",
      "brave",
      "kind",
    ];
    const nouns = [
      "fox",
      "bird",
      "star",
      "moon",
      "sun",
      "tree",
      "lake",
      "wind",
    ];
    const randomNum = Math.floor(Math.random() * 1000);
    const newMark = `${
      adjectives[Math.floor(Math.random() * adjectives.length)]
    }-${nouns[Math.floor(Math.random() * nouns.length)]}-${randomNum}`;
    onMarkChange(newMark);
    setTimeout(() => setIsGenerating(false), 500);
  };

  useEffect(() => {
    generateBookmarkletCode(mark);
  }, [mark, generateBookmarkletCode]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bookmarkletCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mark输入区域 */}
      <MarkInput
        mark={mark}
        onChange={onMarkChange}
        onGenerateRandom={generateRandomMark}
        isGenerating={isGenerating}
      />

      {/* 书签按钮区域 - 响应式布局 */}
      <div className="space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <BookmarkButtons
            mark={mark}
            bookmarkletCode={bookmarkletCode}
            baseUrl={baseUrl}
          />
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            ← 拖拽到书签栏
          </span>
        </div>
      </div>

      {/* 代码显示区域 - 自动换行和滚动 */}
      <details className={`space-y-4 ${styles.details}`}>
        <summary
          className={`flex items-center gap-2 cursor-pointer ${styles.summary}`}
        >
          <Wand2 className="h-5 w-5" />
          查看代码
        </summary>
        <div className="relative">
          <div className="max-h-[200px] overflow-y-auto">
            <pre className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap break-all">
              <code>
                {bookmarkletCode.match(/.{1,50}/g)?.join("\n") ||
                  bookmarkletCode}
              </code>
            </pre>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-2 top-2"
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </details>
    </div>
  );
}
