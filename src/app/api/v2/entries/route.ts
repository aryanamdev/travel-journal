import "@/dbConfig/dbConfig";

import {
  createEntryController,
  getEntriesController,
} from "@/controllers/entryController";

export {
  createEntryController as POST,
  getEntriesController as GET,
};
