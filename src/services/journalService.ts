// src/services/journalService.ts

import Journal from "@/models/journalModel";
import { JournalDTO } from "@/schemas/journal";
import { AppError } from "@/lib/errors";

export const journalService = {
  async create(userId: string, data: JournalDTO) {
    const journal = await Journal.create({ ...data, user: userId });
    return journal.toObject();
  },

  async getAll(userId: string) {
    const journals = await Journal.find({ user: userId }).lean();
    return journals;
  },

  async getById(id: string, userId: string) {
    const journal = await Journal.findOne({ _id: id, user: userId }).lean();
    if (!journal) throw new AppError("Journal not found", 404);
    return journal;
  },

  async update(id: string, userId: string, data: Partial<JournalDTO>) {
    const updatedJournal = await Journal.findOneAndUpdate(
      { _id: id, user: userId },
      data,
      { new: true, runValidators: true, lean: true }
    );

    if (!updatedJournal) throw new AppError("Journal not found", 404);

    return updatedJournal;
  },

  async remove(id: string, userId: string) {
    const deleted = await Journal.findOneAndDelete({ _id: id, user: userId }).lean();

    if (!deleted) throw new AppError("Journal not found", 404);

    return deleted;
  },
};
