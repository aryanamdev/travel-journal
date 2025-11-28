// ZOD SCHEMAS
import { z } from "zod";

export const GeoPointSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]),
});

export const ImageMetaSchema = z.object({
  url: z.string(),
  public_id: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  caption: z.string().optional(),
});

export const CreateEntrySchema = z.object({
  title: z.string(),
  journalId: z.string(),
  authorId: z.string(),
  content: z.string().default(""),
  mood: z.string().optional(),
  weather: z.string().optional(),
  location: GeoPointSchema.optional(),
  images: z.array(ImageMetaSchema).optional(),
  isPublic: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional(),
});

export const UpdateEntrySchema = CreateEntrySchema.partial();

export type CreateEntryDTO = z.infer<typeof CreateEntrySchema>;
export type UpdateEntryDTO = z.infer<typeof UpdateEntrySchema>;
