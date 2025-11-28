// src/services/entryService.ts

import Entry from "@/models/entryModel";
import { AppError } from "@/lib/errors";
import { CreateEntryDTO, UpdateEntryDTO } from "@/schemas/entry";

export const entryService = {
  async create(authorId: string, data: CreateEntryDTO) {
    const entry = await Entry.create({ ...data, authorId });
    return entry.toObject();
  },

  async getAll(authorId: string, journalId?: string) {
    const query: Record<string, unknown> = { authorId };
    if (journalId) {
      query.journalId = journalId;
    }

    const entries = await Entry.find(query).lean();
    return entries;
  },

  async getById(id: string, authorId: string) {
    const entry = await Entry.findOne({ _id: id, authorId }).lean();
    if (!entry) throw new AppError("Entry not found", 404);
    return entry;
  },

  async update(id: string, authorId: string, data: UpdateEntryDTO) {
    const updatedEntry = await Entry.findOneAndUpdate(
      { _id: id, authorId },
      data,
      { new: true, runValidators: true, lean: true }
    );

    if (!updatedEntry) throw new AppError("Entry not found", 404);

    return updatedEntry;
  },

  async remove(id: string, authorId: string) {
    const deleted = await Entry.findOneAndDelete({ _id: id, authorId }).lean();

    if (!deleted) throw new AppError("Entry not found", 404);

    return deleted;
  },
};
