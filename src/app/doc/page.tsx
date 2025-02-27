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
import {
  Book,
  Bookmark,
  BookOpen,
  Check,
  CheckCircle,
  Code,
  ExternalLink,
} from "lucide-react";
import { useMessages, useTranslations } from "next-intl";
import { defaultMark } from "@/lib/types";
import "./page.css";
import { generateRandomMark, getBaseUrl } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DocPage() {
  const t = useTranslations("DocPage");
  const messages = useMessages();
  const [mark, setMark] = useState("");

  useEffect(() => {
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
    <div className="container py-12 max-w-4xl mx-auto">
      {/* 装饰背景元素 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-3xl transform -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-purple-500/10 rounded-full blur-3xl transform translate-y-12 -translate-x-12" />
        <div className="absolute bottom-1/3 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center mb-4 p-2 rounded-full bg-primary/10">
          <Bookmark className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mb-3">
          {t("title")}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("description")}
        </p>
      </div>

      <div className="space-y-12">
        {/* 简介部分 */}
        <section className="prose prose-slate dark:prose-invert mx-auto max-w-none">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <BookOpen className="h-5 w-5 text-primary" />
            什么是 Cloudmark？
          </h2>
          <p>
            Cloudmark
            是一个基于云的书签收集工具，允许您一键保存和组织网页书签，并从任何设备访问。
            不同于传统浏览器的书签功能，Cloudmark 将您的书签存储在云端，
            确保您可以从任何浏览器或设备安全地访问它们。
          </p>
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-6 my-6">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <CheckCircle className="h-5 w-5 text-primary mr-2" />
              主要特点
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>一键保存当前浏览页面</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>云端存储确保跨设备访问</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>按分类整理和筛选书签</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>可自定义的书签集合</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>支持多种排序和布局视图</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>支持多语言界面</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 使用 Bookmarklet 部分 */}
        <section className="prose prose-slate dark:prose-invert mx-auto max-w-none">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Code className="h-5 w-5 text-primary" />
            设置您的 Bookmarklet
          </h2>
          <Card className="content-card backdrop-blur-sm bg-card/50 border border-border/60">
            <CardContent className="p-6 md:p-8 space-y-8">
              <div className="installer-container">
                <BookmarkletInstaller mark={mark} onMarkChange={setMark} />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 使用说明部分 */}
        <section className="prose prose-slate dark:prose-invert mx-auto max-w-none">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Book className="h-5 w-5 text-primary" />
            如何使用 Cloudmark
          </h2>

          <ol className="space-y-6 my-6 list-none pl-0">
            <li className="rounded-lg border p-5 bg-card/30 flex relative overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-4 flex-shrink-0 z-10">
                <span className="font-semibold text-primary">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mt-0 mb-2">
                  设置您的 Bookmarklet
                </h3>
                <p className="mb-0">
                  按照上面的说明创建您的书签集合名称并将 bookmarklet
                  添加到您的浏览器书签栏中。
                  每个书签集合名称对应一个独立的书签集合。
                </p>
              </div>
            </li>

            <li className="rounded-lg border p-5 bg-card/30 flex relative overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-4 flex-shrink-0 z-10">
                <span className="font-semibold text-primary">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mt-0 mb-2">
                  保存网页到您的集合
                </h3>
                <p className="mb-0">
                  当您浏览网页时，点击书签栏中的 Cloudmark
                  bookmarklet，会打开添加书签的页面。
                  填写分类和描述（可选），然后保存即可。
                </p>
              </div>
            </li>

            <li className="rounded-lg border p-5 bg-card/30 flex relative overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-4 flex-shrink-0 z-10">
                <span className="font-semibold text-primary">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mt-0 mb-2">
                  访问您的书签集合
                </h3>
                <p className="mb-0">
                  通过访问{" "}
                  <code>
                    {getBaseUrl()}/{mark}
                  </code>{" "}
                  可以查看和管理您保存的所有书签。
                  您可以在任何设备和浏览器上访问这个 URL。
                </p>
              </div>
            </li>

            <li className="rounded-lg border p-5 bg-card/30 flex relative overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-4 flex-shrink-0 z-10">
                <span className="font-semibold text-primary">4</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mt-0 mb-2">
                  整理和管理您的书签
                </h3>
                <p className="mb-0">
                  您可以编辑或删除书签，更改分类视图，按不同条件排序，
                  以及使用分类筛选器快速找到您需要的书签。
                </p>
              </div>
            </li>
          </ol>
        </section>

        {/* 演示按钮 */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            想要在不创建书签集合的情况下体验 Cloudmark？
          </p>
          <Link href="/demo" className="inline-block">
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
            >
              查看演示
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
