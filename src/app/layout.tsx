import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Github, Search } from "lucide-react";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import Image from "next/image";

export const metadata: Metadata = {
  title: "cloudmark",
  description: "A cloudbased bookmarking service",
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      }
    ],
  }
};

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
          <div className="min-h-screen flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,rgba(147,51,234,0.15),transparent_70%),radial-gradient(ellipse_at_right,rgba(59,130,246,0.15),transparent_70%)]">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center">
                <Link href="/" className="flex items-center space-x-2">
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

                <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
                  <Link
                    href="/doc"
                    className="text-sm font-medium text-muted-foreground hover:text-primary"
                  >
                    Docs
                  </Link>
                  <Link
                    href="https://github.com/wesleyel/cloudmark"
                    className="text-sm font-medium text-muted-foreground hover:text-primary"
                  >
                    <Github className="h-5 w-5" />
                  </Link>
                  <LanguageSwitcher />
                </nav>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            {/* Footer */}
            <footer className="border-t border-border/40 mt-auto">
              <div className="container flex flex-col gap-2 py-6 text-center">
                <p className="text-xs text-muted-foreground">
                  Released under the MIT License.
                </p>
                <p className="text-xs text-muted-foreground">
                  Copyright © {new Date().getFullYear()} BookmarkHub
                </p>
              </div>
            </footer>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
