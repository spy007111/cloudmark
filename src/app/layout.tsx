import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Github, FileText, Globe } from "lucide-react";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ToastProvider } from "@/components/toast-provider";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  title: "Cloudmark - Your Universal Bookmark Manager",
  description:
    "Save and access your bookmarks from anywhere with Cloudmark, the seamless cloud bookmarking tool for professionals and casual users alike",
  keywords:
    "bookmarks, cloud storage, bookmark manager, save links, web tool, productivity",
  authors: [{ name: "Wesley Yang" }],
  creator: "Cloudmark",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    title: "Cloudmark - Your Universal Bookmark Manager",
    description:
      "Save and access your bookmarks from anywhere with Cloudmark, the seamless cloud bookmarking tool for professionals and casual users alike",
    siteName: "Cloudmark",
    images: [
      {
        url: "/og-image-en.png",
        width: 1200,
        height: 630,
        alt: "Cloudmark Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloudmark - Your Universal Bookmark Manager",
    description: "Save and access your bookmarks from anywhere with Cloudmark",
    images: ["/og-image-en.png"],
  },
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

function Navigation() {
  const t = useTranslations("Navigation");

  return (
    <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
      <Link
        href="/doc"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors duration-200"
      >
        <FileText className="h-4 w-4" />
        <span>{t("quickstart")}</span>
      </Link>
      <Link
        href="https://github.com/wesleyel/cloudmark"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors duration-200"
      >
        <Github className="h-4 w-4" />
        <span className="hidden sm:inline">{t("github")}</span>
      </Link>
      <div className="pl-1 border-l border-border/40">
        <LanguageSwitcher />
      </div>
    </nav>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            <div className="min-h-screen flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,rgba(147,51,234,0.15),transparent_70%),radial-gradient(ellipse_at_right,rgba(59,130,246,0.15),transparent_70%)]">
              {/* Header */}
              <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                  <Link
                    href="/"
                    className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105"
                  >
                    <Image
                      src="/favicon.svg"
                      alt="Cloudmark logo"
                      width={24}
                      height={24}
                      className="h-6 w-6 text-primary"
                    />
                    <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                      Cloudmark
                    </span>
                  </Link>

                  <Navigation />
                </div>
              </header>
              <main className="flex-1">{children}</main>
              {/* Footer */}
              <footer className="border-t border-border/40 mt-auto">
                <div className="container flex flex-col gap-2 py-6 text-center">
                  <p className="text-xs text-muted-foreground">
                    Released under the AGPL License.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Copyright © {new Date().getFullYear()} Wesley Yang
                  </p>
                </div>
              </footer>
            </div>
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
