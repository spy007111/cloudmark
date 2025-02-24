import Link from "next/link"
import { LandingPage } from "@/components/landing-page"

interface PageProps {
  searchParams: {
    mark?: string
    lang?: string
  }
}

export default function Page({ searchParams }: PageProps) {
  const { mark, lang = 'en' } = searchParams
  const translations = {
    en: {
      start: 'Get Started',
      quickstart: 'Quick Start',
      title: 'Your Universal Bookmark Manager',
      description: 'Save and organize your bookmarks with one click. Access them anywhere, anytime.',
      features: {
        save: {
          title: 'One-Click Save',
          desc: 'Save any webpage to your collection with a simple drag and drop installation.'
        },
        categorize: {
          title: 'Smart Categories',
          desc: 'Automatically categorize your bookmarks for better organization.'
        },
        access: {
          title: 'Access Anywhere',
          desc: 'Sync across devices, access your bookmarks anywhere.'
        },
        share: {
          title: 'Share & Collaborate',
          desc: 'Easily share bookmark collections and collaborate with others.'
        }
      }
    },
    zh: {
      start: '开始使用',
      quickstart: '快速入门',
      title: '你的通用书签管理器',
      description: '一键保存和整理书签。随时随地访问。',
      features: {
        save: {
          title: '一键收藏',
          desc: '通过简单的拖拽安装，一键保存任何网页到您的收藏夹。'
        },
        categorize: {
          title: '智能分类',
          desc: '自动对书签进行分类，让您的收藏更有条理。'
        },
        access: {
          title: '随处访问',
          desc: '跨设备同步，随时随地访问您的书签收藏。'
        },
        share: {
          title: '分享协作',
          desc: '轻松与他人分享书签集合，协同整理资源。'
        }
      }
    }
  }

  const t = translations[lang as keyof typeof translations] || translations.en

  return (
    <LandingPage>
      <div className="container relative">
        <div className="flex flex-col items-start py-20 lg:py-32 gap-4">
          {/* Main Title */}
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-2">
            Cloudmark {mark && `- ${mark}`}
          </h1>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground max-w-3xl">
            {t.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-[42rem]">
            {t.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 mt-4">
            <Link
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              {t.start}
            </Link>
            <Link
              href="#quickstart"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {t.quickstart}
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-20">
          {Object.entries(t.features).map(([key, feature]) => (
            <div key={key} className="group relative rounded-lg border p-6 shadow-md transition-shadow hover:shadow-lg">
              <h3 className="font-semibold mb-2 text-lg">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </LandingPage>
  )
}