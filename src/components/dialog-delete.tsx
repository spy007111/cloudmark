"use client";

import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";
import { useTranslations } from "next-intl";
import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { deleteBookmarkAction } from "@/lib/actions";
import { deleteSchema, type DeleteSchema } from "@/lib/schema";
import type { BookmarkInstance } from "@/lib/types";

interface DialogDeleteProps {
  mark: string;
  bookmark: BookmarkInstance;
  onBookmarkDeleted: () => void;
}

export function DialogDelete({
  mark,
  bookmark,
  onBookmarkDeleted,
}: DialogDeleteProps) {
  const t = useTranslations("Components.BookmarkDialog");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DeleteSchema>({
    // @ts-ignore
    resolver: zodResolver(deleteSchema),
    defaultValues: {
      mark,
      uuid: bookmark.uuid,
    },
  });

  const { execute: deleteBookmark } = useServerAction(deleteBookmarkAction, {
    onError: (error) => {
      setIsSubmitting(false);
      toast.dismiss();
      toast.error(error.err.message || t("errors.deleteFailed"));
    },
    onStart: () => {
      setIsSubmitting(true);
      toast.loading(t("deleting"));
    },
    onSuccess: async () => {
      setIsSubmitting(false);
      toast.dismiss();
      toast.success(t("deleteSuccess"));
      onBookmarkDeleted();
      form.reset();
    },
  });

  const onSubmit = async (data: DeleteSchema) => {
    const formData = new FormData();
    formData.append("mark", data.mark);
    formData.append("uuid", data.uuid);

    deleteBookmark(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="dialog-content sm:max-w-[425px] border border-red-500/20 bg-card/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <span className="bg-red-500/10 p-1.5 rounded-md">
              <Trash2 className="h-4 w-4 text-red-500" />
            </span>
            {t("deleteTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("deleteDescription", { title: bookmark.title })}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormDescription className="text-center text-muted-foreground">
              {t("deleteConfirmation", { title: bookmark.title })}
            </FormDescription>

            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  {t("cancel")}
                </Button>
              </DialogClose>
              <div className="hover-scale-sm">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="destructive"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("deleteButton")}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 