import type { BookmarkInstance } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Trash2, Edit2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface BookmarkCardProps {
  bookmark: BookmarkInstance
  onDelete: () => void
  onEdit: () => void
}

export function BookmarkCard({ bookmark, onDelete, onEdit }: BookmarkCardProps) {
  const { url, title, favicon, createdAt, category, description } = bookmark

  // Format the date to be more readable
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true })

  // Extract domain for display
  const domain = new URL(url).hostname.replace("www.", "")

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-0 flex flex-row items-center gap-2">
        {favicon ? (
          <img
            src={favicon || "/placeholder.svg"}
            alt={`${title} favicon`}
            className="w-5 h-5 rounded-sm"
            onError={(e) => {
              // If favicon fails to load, replace with a default icon
              ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=20&width=20"
            }}
          />
        ) : (
          <div className="w-5 h-5 bg-muted rounded-sm flex items-center justify-center">
            <ExternalLink className="w-3 h-3 text-muted-foreground" />
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
        {description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" className="w-full mr-2" onClick={() => window.open(url, "_blank")}>
          <ExternalLink className="h-3 w-3 mr-1" />
          Visit
        </Button>
        <div className="flex space-x-1">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit2 className="h-3 w-3" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="h-3 w-3" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

