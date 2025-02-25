import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
  return (
    <div className="mb-4">
      <h2 className="text-sm font-medium mb-2">Categories</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 pb-1">
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onSelectCategory(null)}
          >
            All
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
