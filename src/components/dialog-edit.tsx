"use client";

import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";
import { useTranslations } from "next-intl";
import { Loader2, Link, FileText, Tag, Pencil, Edit2 } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { updateBookmarkAction } from "@/lib/actions";
import { updateSchema, type UpdateSchema } from "@/lib/schema";
import type { BookmarkInstance } from "@/lib/types";

interface DialogEditProps {
  mark: string;
  bookmark: BookmarkInstance;
  categories: string[];
  onBookmarkUpdated: (bookmark: BookmarkInstance) => void;
}

export function DialogEdit({
  mark,
  bookmark,
  categories,
  onBookmarkUpdated,
}: DialogEditProps) {
  const t = useTranslations("Components.BookmarkDialog");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateSchema>({
    // @ts-ignore
    resolver: zodResolver(updateSchema),
    defaultValues: {
      mark,
      uuid: bookmark.uuid,
      url: bookmark.url,
      title: bookmark.title,
      description: bookmark.description || "",
      category: bookmark.category,
    },
  });

  const { execute: update } = useServerAction(updateBookmarkAction, {
    onError: (error) => {
      setIsSubmitting(false);
      toast.dismiss();
      toast.error(error.err.message || t("errors.updateFailed"));
    },
    onStart: () => {
      setIsSubmitting(true);
      toast.loading(t("updating"));
    },
    onSuccess: async (bookmark) => {
      setIsSubmitting(false);
      toast.dismiss();
      toast.success(t("updateSuccess"));
      onBookmarkUpdated(bookmark.data);
      form.reset();
    },
  });

  const onSubmit = async (data: UpdateSchema) => {
    const formData = new FormData();
    formData.append("mark", data.mark);
    formData.append("uuid", data.uuid);
    formData.append("url", data.url);
    formData.append("title", data.title);
    formData.append("description", data.description || "");
    formData.append("category", data.category);

    update(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-indigo-500/20 hover:border-indigo-500/40 bg-indigo-500/5 hover:bg-indigo-500/10"
        >
          <Edit2 className="h-3 w-3" />
          <span className="sr-only">{t("edit")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="dialog-content sm:max-w-[425px] border border-blue-500/20 bg-card/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <span className="bg-blue-500/10 p-1.5 rounded-md">
              <Pencil className="h-4 w-4 text-blue-500" />
            </span>
            {t("editTitle")}
          </DialogTitle>
          <DialogDescription>{t("editDescription")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4"
          >
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Link className="h-3.5 w-3.5 text-blue-500" />
                    {t("url")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("urlPlaceholder")}
                      className="border-blue-500/20 focus:border-blue-500/40 bg-blue-500/5 focus:ring-blue-500/10"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t("urlDescription")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-indigo-500" />
                    {t("title")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("titlePlaceholder")}
                      className="border-indigo-500/20 focus:border-indigo-500/40 bg-indigo-500/5 focus:ring-indigo-500/10"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t("titleDescription")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-purple-500" />
                    {t("description")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("descriptionPlaceholder")}
                      className="border-purple-500/20 focus:border-purple-500/40 bg-purple-500/5 focus:ring-purple-500/10"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("descriptionDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-green-500" />
                    {t("category")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-green-500/20 focus:border-green-500/40 bg-green-500/5 focus:ring-green-500/10">
                        <SelectValue placeholder={t("categoryPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>{t("categoryDescription")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("updateButton")}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
