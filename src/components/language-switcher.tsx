'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' }
]

export function LanguageSwitcher() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentLang = searchParams.get('lang') || 'en'

  const handleLanguageChange = (langCode: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('lang', langCode)
    router.push(`?${params.toString()}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={currentLang === lang.code ? "bg-accent" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}