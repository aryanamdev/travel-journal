import { create } from "zustand";
import type { User } from "@/types/user";
import type { Journal } from "@/types/journal";
import type { Entry } from "@/types/entry";

export type JournalStoreState = {
  me: User | null;
  loadingUser: boolean;
  journals: Journal[];
  entries: Entry[];
  selectedJournalId: string | null;

  setMe: (me: User | null) => void;
  setLoadingUser: (loading: boolean) => void;
  setJournals: (journals: Journal[]) => void;
  setEntries: (entries: Entry[]) => void;
  setSelectedJournalId: (id: string | null) => void;
  reset: () => void;
};

const initialState = {
  me: null,
  loadingUser: true,
  journals: [],
  entries: [],
  selectedJournalId: null,
} satisfies Omit<JournalStoreState, "setMe" | "setLoadingUser" | "setJournals" | "setEntries" | "setSelectedJournalId" | "reset">;

export const useJournalStore = create<JournalStoreState>((set) => ({
  ...initialState,
  setMe: (me) => set({ me }),
  setLoadingUser: (loadingUser) => set({ loadingUser }),
  setJournals: (journals) => set({ journals }),
  setEntries: (entries) => set({ entries }),
  setSelectedJournalId: (selectedJournalId) => set({ selectedJournalId }),
  reset: () => set(initialState),
}));
