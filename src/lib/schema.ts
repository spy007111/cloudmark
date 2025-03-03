"use server";

import { z } from "zod";

export const baseSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
});

export const insertSchema = baseSchema.extend({
  mark: z.string().min(1),
});

export const updateSchema = baseSchema.extend({
  mark: z.string().min(1),
  uuid: z.string().min(1),
});

export const deleteSchema = z.object({
  mark: z.string().min(1),
  uuid: z.string().min(1),
});
