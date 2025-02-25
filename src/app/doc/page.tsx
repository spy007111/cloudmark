"use client";
import { useState } from "react";
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

export default function DocPage() {
  const t = useTranslations("DocPage");
  const messgages = useMessages();
  const [mark, setMark] = useState(defaultMark);

  return (
    <div className="container py-12">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            {t("title")}
          </CardTitle>
          <CardDescription>
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <BookmarkletInstaller
            mark={mark}
            onMarkChange={setMark}
          />
          {/* 安装说明 */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t("method1.title")}</h3>
            <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
              <li>
                {t("method1.steps.1")} <kbd>{t("keyboard.showBookmarks")}</kbd> {t("method1.steps.1_end")}
              </li>
              <li>
                {t("method1.steps.2")}:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>{t("method1.steps.2_1", { mark })}</li>
                  <li>{t("method1.steps.2_2", { mark })}</li>
                </ul>
              </li>
              <li>{t("method1.steps.3")}</li>
            </ol>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">{t("method2.title")}</h3>
            <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
              <li>
                {t("method2.steps.1")} <kbd>{t("keyboard.showBookmarks")}</kbd> {t("method2.steps.1_end")}
              </li>
              <li>{t("method2.steps.2")}</li>
              <li>{t("method2.steps.3", { mark })}</li>
              <li>{t("method2.steps.4")}</li>
              <li>{t("method2.steps.5")}</li>
              <li>{t("method2.steps.6")}</li>
            </ol>
          </div>
          {/* 使用说明 */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t("usage.title")}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{t("usage.intro")}</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>{t("usage.steps.1", { mark })}</li>
                <li>{t("usage.steps.2")}</li>
                <li>
                  {t("usage.steps.3")}:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>{t("usage.steps.3_1")}</li>
                    <li>{t("usage.steps.3_2")}</li>
                    <li>{t("usage.steps.3_3")}</li>
                  </ul>
                </li>
              </ol>
              <p className="mt-2">
                {t("usage.tip", { mark })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
