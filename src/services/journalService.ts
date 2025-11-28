// src/services/journalService.ts

import Journal from "@/models/journalModel";
import { CreateJournalDTO, JournalDTO } from "@/schemas/journal";
import { AppError } from "@/lib/errors";

export const journalService = {
  async create(userId: string, data: CreateJournalDTO) {
    const journal = await Journal.create({ ...data, createdBy: userId });
    return journal.toObject();
  },

  async getAll(userId: string) {
    console.log({userId})

    const journals = await Journal.find({ createdBy: userId }).lean();
    return journals;
  },

  async getById(id: string, userId: string) {
    const journal = await Journal.findOne({ _id: id, user: userId }).lean();
    if (!journal) throw new AppError("Journal not found", 404);
    return journal;
  },

  async update(id: string, userId: string, data: Partial<JournalDTO>) {
    const updatedJournal = await Journal.findOneAndUpdate(
      { _id: id, createdBy: userId },
      data,
      { new: true, runValidators: true, lean: true }
    );

    if (!updatedJournal) throw new AppError("Journal not found", 404);

    return updatedJournal;
  },

  async remove(id: string, userId: string) {
    const deleted = await Journal.findOneAndDelete({ _id: id, createdBy: userId }).lean();

    if (!deleted) throw new AppError("Journal not found", 404);

    return deleted;
  },
};
