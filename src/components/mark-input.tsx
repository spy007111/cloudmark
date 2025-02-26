import { RefreshCcw, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
      <div className="space-y-3">
        <Label 
          htmlFor="mark" 
          className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500"
        >
          书签标记
        </Label>
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <Input
              id="mark"
              value={mark}
              onChange={(e) => onChange(e.target.value)}
              placeholder="输入自定义标记"
              className="pr-10 h-11 border-border/60 bg-background/50 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all"
            />
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  "absolute right-0 top-0 h-full w-10 px-3 transition-all text-muted-foreground hover:text-foreground",
                  isGenerating && "animate-spin",
                )}
                onClick={onGenerateRandom}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="secondary"
              className="flex-shrink-0 h-11 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/20 shadow-sm"
              onClick={onGenerateRandom}
            >
              <Wand2 className="mr-2 h-4 w-4" />
              随机生成
            </Button>
          </motion.div>
        </div>
        <div className="bg-blue-500/5 border border-blue-500/10 rounded-md p-3 text-sm text-muted-foreground">
          <p>
            标记将用于区分不同的书签收藏，建议使用有意义的词组。当前标记：
            <span className="font-medium text-foreground ml-1">{mark}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
