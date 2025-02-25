import { RefreshCcw, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface MarkInputProps {
  mark: string;
  onChange: (value: string) => void;
  onGenerateRandom: () => void;
  isGenerating: boolean;
}

export function MarkInput({
  mark,
  onChange,
  onGenerateRandom,
  isGenerating,
}: MarkInputProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mark">书签标记</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="mark"
              value={mark}
              onChange={(e) => onChange(e.target.value)}
              placeholder="输入自定义标记"
              className="pr-10"
            />
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "absolute right-0 top-0 h-full w-10 px-3 transition-transform",
                isGenerating && "animate-spin"
              )}
              onClick={onGenerateRandom}
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="secondary"
            className="flex-shrink-0"
            onClick={onGenerateRandom}
          >
            <Wand2 className="mr-2 h-4 w-4" />
            随机生成
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          标记将用于区分不同的书签收藏，建议使用有意义的词组
        </p>
      </div>
    </div>
  );
}