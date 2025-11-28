export interface ImageMeta {
  url: string;
  public_id?: string;
  width?: number;
  height?: number;
  caption?: string;
}

export interface GeoPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface IEntry {
  _id: string;
  title: string;
  journalId: string;
  authorId: string;
  content: string;
  mood?: string;
  weather?: string;
  location?: GeoPoint | null;
  images?: ImageMeta[];
  isPublic?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Frontend-friendly type
export type Entry = IEntry;

// Payloads used on the client
export type CreateEntryInput = Omit<IEntry, "_id" | "authorId" | "createdAt" | "updatedAt">;
export type UpdateEntryInput = Partial<CreateEntryInput>;

// Type for API responses
export type EntryResponse = {
  success: boolean;
  message?: string;
  data?: Entry | Entry[];
};

// Optional list response with pagination
export type EntryListResponse = {
  success: boolean;
  data: {
    entries: Entry[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
