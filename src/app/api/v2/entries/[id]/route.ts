import "@/dbConfig/dbConfig";

import {
  getEntryController,
  updateEntryController,
  deleteEntryController,
} from "@/controllers/entryController";

export {
  getEntryController as GET,
  updateEntryController as PATCH,
  deleteEntryController as DELETE,
};
