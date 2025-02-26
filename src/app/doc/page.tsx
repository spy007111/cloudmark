"use client";
import { useState, useEffect } from "react";
import BookmarkletInstaller from "@/components/bookmarklet-installer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bookmark } from "lucide-react";
import { useMessages, useTranslations } from "next-intl";
import { defaultMark } from "@/lib/types";
import "./page.css";

export default function DocPage() {
  const t = useTranslations("DocPage");
  const messages = useMessages();
  const [mark, setMark] = useState("");

  useEffect(() => {
    const generateRandomMark = () => {
      const adjectives = [
        "vacuous",
        "tearful",
        "faint",
        "jumbled",
        "wandering",
        "mature",
        "savory",
        "mighty",
        "disgusted",
        "abstracted",
        "telling",
      ];
      const nouns = [
        "person",
        "inspector",
        "significance",
        "chapter",
        "reputation",
        "outcome",
        "association",
        "failure",
        "population",
        "wealth",
        "bird",
      ];
      const randomNum = Math.floor(Math.random() * 10000);
      return `${
        adjectives[Math.floor(Math.random() * adjectives.length)]
      }-${nouns[Math.floor(Math.random() * nouns.length)]}-${randomNum}`;
    };

    setMark(generateRandomMark());
  }, []);

  if (!mark) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="fade-in text-center">
          <p className="text-muted-foreground">{t("loading") || "加载中..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container relative">
      {/* 装饰背景元素 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-3xl transform -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-purple-500/10 rounded-full blur-3xl transform translate-y-12 -translate-x-12" />
        <div className="absolute bottom-1/3 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="py-12 lg:py-16">
        {/* 标题区域 */}
        <div className="title-area text-center mb-10">
          <h1 className="title-text text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
            {t("title")}
          </h1>
          <p className="subtitle-text text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        {/* 主要内容卡片 */}
        <div className="stagger-container max-w-3xl mx-auto">
          <Card className="content-card backdrop-blur-sm bg-card/50 border border-border/60">
            <CardContent className="p-6 md:p-8 space-y-8">
              <div className="installer-container">
                <BookmarkletInstaller mark={mark} onMarkChange={setMark} />
              </div>

              {/* 安装说明 */}
              <div className="method-section delay-200 space-y-6">
                <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
                  {t("method1.title")}
                </h2>
                <ol className="list-decimal list-outside ml-5 space-y-4 text-muted-foreground">
                  <li>
                    <span className="text-foreground font-medium">
                      {t("method1.steps.1")}
                    </span>
                    <kbd className="px-2 py-1 mx-1 text-xs font-semibold rounded bg-muted border border-border">
                      {t("keyboard.showBookmarks")}
                    </kbd>
                    {t("method1.steps.1_end")}
                  </li>
                  <li>
                    <span className="text-foreground font-medium">
                      {t("method1.steps.2")}:
                    </span>
                    <ul className="list-disc list-outside ml-5 mt-2 space-y-2">
                      <li>{t("method1.steps.2_1", { mark })}</li>
                      <li>{t("method1.steps.2_2", { mark })}</li>
                    </ul>
                  </li>
                  <li>
                    <span className="text-foreground font-medium">
                      {t("method1.steps.3")}
                    </span>
                  </li>
                </ol>
              </div>

              <div className="method-section delay-300 space-y-6">
                <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                  {t("method2.title")}
                </h2>
                <ol className="list-decimal list-outside ml-5 space-y-4 text-muted-foreground">
                  <li>
                    <span className="text-foreground font-medium">
                      {t("method2.steps.1")}
                    </span>
                    <kbd className="px-2 py-1 mx-1 text-xs font-semibold rounded bg-muted border border-border">
                      {t("keyboard.showBookmarks")}
                    </kbd>
                    {t("method2.steps.1_end")}
                  </li>
                  <li>
                    <span className="text-foreground font-medium">
                      {t("method2.steps.2")}
                    </span>
                  </li>
                  <li>
                    <span className="text-foreground font-medium">
                      {t("method2.steps.3", { mark })}
                    </span>
                  </li>
                  <li>
                    <span className="text-foreground font-medium">
                      {t("method2.steps.4")}
                    </span>
                  </li>
                  <li>
                    <span className="text-foreground font-medium">
                      {t("method2.steps.5")}
                    </span>
                  </li>
                  <li>
                    <span className="text-foreground font-medium">
                      {t("method2.steps.6")}
                    </span>
                  </li>
                </ol>
              </div>

              {/* 使用说明 */}
              <div className="usage-section delay-400 space-y-6">
                <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                  {t("usage.title")}
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-foreground">{t("usage.intro")}</p>
                  <ol className="list-decimal list-outside ml-5 space-y-4">
                    <li>
                      <span className="text-foreground font-medium">
                        {t("usage.steps.1", { mark })}
                      </span>
                    </li>
                    <li>
                      <span className="text-foreground font-medium">
                        {t("usage.steps.2")}
                      </span>
                    </li>
                    <li>
                      <span className="text-foreground font-medium">
                        {t("usage.steps.3")}:
                      </span>
                      <ul className="list-disc list-outside ml-5 mt-2 space-y-2">
                        <li>{t("usage.steps.3_1")}</li>
                        <li>{t("usage.steps.3_2")}</li>
                        <li>{t("usage.steps.3_3")}</li>
                      </ul>
                    </li>
                  </ol>
                  <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-foreground">
                      {t("usage.tip", { mark })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
