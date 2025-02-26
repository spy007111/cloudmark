import type { BookmarkInstance } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Trash2, Edit2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface BookmarkCardProps {
  bookmark: BookmarkInstance;
  onDelete: () => void;
  onEdit: () => void;
}

export function BookmarkCard({
  bookmark,
  onDelete,
  onEdit,
}: BookmarkCardProps) {
  const t = useTranslations("Components.BookmarkCard");
  const { url, title, favicon, createdAt, category, description } = bookmark;

  // Format the date to be more readable
  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  // Extract domain for display
  const domain = new URL(url).hostname.replace("www.", "");

  const handleDelete = () => {
    if (window.confirm(t("deleteConfirm"))) {
      onDelete();
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md backdrop-blur-sm bg-card/50 border border-border/60">
      <CardHeader className="p-4 pb-0 flex flex-row items-center gap-2">
        {favicon ? (
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-500/5 rounded-md"></div>
            <img
              src={favicon || `https://favicone.com/${domain}?s=32`}
              alt={`${title} favicon`}
              className="w-6 h-6 rounded-sm relative z-10"
              onError={(e) => {
                // If favicon fails to load, replace with a default icon
                (e.target as HTMLImageElement).src =
                  "/placeholder.svg?height=20&width=20";
              }}
            />
          </div>
        ) : (
          <div className="w-8 h-8 bg-blue-500/5 rounded-md flex items-center justify-center">
            <ExternalLink className="w-4 h-4 text-blue-500/70" />
          </div>
        )}
        <div className="flex-1 truncate">
          <h3 className="font-medium text-sm truncate" title={title}>
            {title}
          </h3>
          <p className="text-xs text-muted-foreground truncate" title={url}>
            {domain}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className="text-xs bg-blue-500/5 border-blue-500/20 text-blue-700 dark:text-blue-300"
          >
            {category}
          </Badge>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <motion.div 
          className="w-full mr-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full border-blue-500/20 hover:border-blue-500/40 bg-blue-500/5 hover:bg-blue-500/10"
            onClick={() => window.open(url, "_blank")}
          >
            <ExternalLink className="h-3 w-3 mr-2" />
            {t("visit")}
          </Button>
        </motion.div>
        <div className="flex space-x-2">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEdit}
              className="border-indigo-500/20 hover:border-indigo-500/40 bg-indigo-500/5 hover:bg-indigo-500/10"
            >
              <Edit2 className="h-3 w-3" />
              <span className="sr-only">{t("edit")}</span>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDelete}
              className="border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 text-red-500/80 hover:text-red-500"
            >
              <Trash2 className="h-3 w-3" />
              <span className="sr-only">{t("delete")}</span>
            </Button>
          </motion.div>
        </div>
      </CardFooter>
    </Card>
  );
}
