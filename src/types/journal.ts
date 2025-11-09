import { Types } from "mongoose";

// Base interface that matches the schema
export interface IJournal {
  _id?: Types.ObjectId;
  title: string;
  description?: string;
  color?: string;
  coverImage?: string;
  isShared?: boolean;
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// Frontend-friendly type (converts ObjectId to string)
export type Journal = Omit<IJournal, "_id" | "createdBy"> & {
  _id: string;
  createdBy: string;
};

// Type for creating a new journal (omits auto-generated fields)
export type CreateJournalInput = Omit<IJournal, "_id" | "createdAt" | "updatedAt">;

// Type for updating a journal (all fields optional)
export type UpdateJournalInput = Partial<CreateJournalInput>;

// Type for API responses
export type JournalResponse = {
  success: boolean;
  message?: string;
  data?: Journal | Journal[];
};

// Type for journal list with pagination
export type JournalListResponse = {
  success: boolean;
  data: {
    journals: Journal[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};