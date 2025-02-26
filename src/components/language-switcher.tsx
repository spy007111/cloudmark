"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";
import { Locale } from "@/i18n/config";
import { setUserLocale } from "@/services/locale";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";

const languages = [
  { code: "en", name: "English" },
  { code: "zh", name: "中文" },
];

export function LanguageSwitcher() {
  const currentLang = useLocale();
  const t = useTranslations("Navigation");

  const handleLanguageChange = (langCode: string) => {
    const locale = langCode as Locale;
    setUserLocale(locale);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-md text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors duration-200 focus-visible:ring-offset-0 flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{t("switchLanguage")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[130px] overflow-hidden">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors duration-200 ${
              currentLang === lang.code
                ? "bg-primary/10 text-primary"
                : "hover:bg-accent"
            }`}
          >
            <span>{lang.name}</span>
            {currentLang === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
