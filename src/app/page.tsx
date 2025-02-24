'use client'

import { Button } from "@/components/ui/button"
import { Bookmark, Github, Search } from "lucide-react"
import Link from "next/link"

export default function Page() {
  const bookmarkletCode = `javascript:(function(){window.open('https://yourdomain.com/save?url='+encodeURIComponent(window.location.href)+'&title='+encodeURIComponent(document.title),'_blank');})();`

  return (
    <div className="min-h-dvh bg-gradient-to-br from-background to-background relative overflow-hidden">
      {/* Gradient Effects */}
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-purple-500/30 blur-[128px] opacity-20" />
      <div className="absolute top-20 right-20 w-[600px] h-[400px] bg-blue-500/30 blur-[128px] opacity-20" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Bookmark className="h-6 w-6 text-primary" />
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              BookmarkHub
            </span>
          </Link>

          {/* Search */}
          <div className="flex items-center ml-4 lg:ml-6">
            <Button variant="ghost" size="icon" className="mr-2">
              <Search className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground hidden sm:inline-block">⌘K</span>
          </div>

          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Features
            </Link>
            <Link href="#docs" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Docs
            </Link>
            <Link href="https://github.com" className="text-sm font-medium text-muted-foreground hover:text-primary">
              <Github className="h-5 w-5" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container relative">
        <div className="flex flex-col items-start py-20 lg:py-32 gap-4">
          {/* Main Title */}
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-2">
            BookmarkHub
          </h1>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground max-w-3xl">
            Your Universal Bookmark Manager
          </h2>
          <p className="text-xl text-muted-foreground max-w-[42rem]">
            Save and organize your bookmarks with one click. Access them anywhere, anytime.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 mt-4">
            <Link
              href={bookmarkletCode}
              onClick={(e) => {
                e.preventDefault()
                alert("请将此按钮拖拽到您的书签栏")
              }}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              draggable="true"
            >
              开始使用
            </Link>
            <Link
              href="#quickstart"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              快速入门
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-20">
          <div className="group relative rounded-lg border p-6 shadow-md transition-shadow hover:shadow-lg">
            <h3 className="font-semibold mb-2 text-lg">一键收藏</h3>
            <p className="text-sm text-muted-foreground">通过简单的拖拽安装，一键保存任何网页到您的收藏夹。</p>
          </div>
          <div className="group relative rounded-lg border p-6 shadow-md transition-shadow hover:shadow-lg">
            <h3 className="font-semibold mb-2 text-lg">智能分类</h3>
            <p className="text-sm text-muted-foreground">自动对书签进行分类，让您的收藏更有条理。</p>
          </div>
          <div className="group relative rounded-lg border p-6 shadow-md transition-shadow hover:shadow-lg">
            <h3 className="font-semibold mb-2 text-lg">随处访问</h3>
            <p className="text-sm text-muted-foreground">跨设备同步，随时随地访问您的书签收藏。</p>
          </div>
          <div className="group relative rounded-lg border p-6 shadow-md transition-shadow hover:shadow-lg">
            <h3 className="font-semibold mb-2 text-lg">分享协作</h3>
            <p className="text-sm text-muted-foreground">轻松与他人分享书签集合，协同整理资源。</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40">
        <div className="container flex flex-col gap-2 py-6 text-center">
          <p className="text-xs text-muted-foreground">Released under the MIT License.</p>
          <p className="text-xs text-muted-foreground">Copyright © {new Date().getFullYear()} BookmarkHub</p>
        </div>
      </footer>
    </div>
  )
}

