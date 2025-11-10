import { z } from "zod";

// Common ObjectId validator (24-char hex)
export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

// Backend Schema (IJournal)
export const JournalSchema = z.object({
    _id: objectIdSchema.optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    color: z.string().optional(),
    coverImage: z.string().url("Invalid URL format").optional(),
    isShared: z.boolean().optional(),
    createdBy: objectIdSchema,
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});


export const CreateJournalSchema = JournalSchema.omit({
    _id: true,
    createdBy: true,
    createdAt: true,
    updatedAt: true,
})

export type JournalDTO = z.infer<typeof JournalSchema>;