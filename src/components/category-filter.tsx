import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tag } from "lucide-react";
import { useTranslations } from "next-intl";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const t = useTranslations("BookmarksPage.categories");

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="h-4 w-4 text-blue-500" />
        <h2 className="text-sm font-medium text-muted-foreground">
          {t("filter")}
        </h2>
      </div>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 pb-1">
          <div>
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className={`cursor-pointer ${
                selectedCategory === null
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  : "hover:bg-blue-500/10"
              }`}
              onClick={() => onSelectCategory(null)}
            >
              {t("all")}
            </Badge>
          </div>
          {categories.map((category) => (
            <div key={category}>
              <Badge
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    : "hover:bg-blue-500/10"
                }`}
                onClick={() => onSelectCategory(category)}
              >
                {category}
              </Badge>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  );
}
