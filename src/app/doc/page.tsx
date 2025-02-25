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

export default function DocPage() {
  const [mark, setMark] = useState("my-bookmark"); // 添加状态
  return (
    <div className="container py-12">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            自定义书签工具
          </CardTitle>
          <CardDescription>
            自定义你的书签标记，或使用随机生成的标记
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <BookmarkletInstaller
            mark={mark}
            onMarkChange={setMark} // 传递状态更新函数
          />
          {/* 安装说明 */}
          <div className="space-y-4">
            <h3 className="font-semibold">安装方法一：拖拽安装（推荐）</h3>
            <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
              <li>
                确保浏览器显示了书签栏（Chrome按 <kbd>Ctrl+Shift+B</kbd> 显示）
              </li>
              <li>
                将上方的两个按钮分别拖拽到书签栏：
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>"保存到 {mark}" - 用于保存当前页面</li>
                  <li>"打开 {mark}" - 快速查看已保存的内容</li>
                </ul>
              </li>
              <li>松开鼠标完成安装</li>
            </ol>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">安装方法二：手动创建</h3>
            <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
              <li>
                在浏览器中按 <kbd>Ctrl+Shift+B</kbd> 显示书签栏
              </li>
              <li>右键点击书签栏，选择"添加书签"或"添加网页"</li>
              <li>名称输入："保存到 {mark}"</li>
              <li>网址(URL)框中粘贴上方代码框中的完整代码</li>
              <li>选择保存在"书签栏"文件夹中</li>
              <li>点击保存完成安装</li>
            </ol>
          </div>
          {/* 使用说明 */}
          <div className="space-y-4">
            <h3 className="font-semibold">使用说明：</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>当你浏览到想要保存的网页时：</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>点击书签栏中的"保存到 {mark}"</li>
                <li>页面会自动跳转到收藏系统</li>
                <li>
                  系统会保存当前页面的：
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>网页标题</li>
                    <li>网址(URL)</li>
                    <li>网站图标</li>
                    <li>你设定的标记：{mark}</li>
                  </ul>
                </li>
              </ol>
              <p className="mt-2">
                提示：你可以随时回到本页面，重新生成带有不同标记的书签工具。
                不同的标记可以帮助你更好地分类管理保存的内容。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
