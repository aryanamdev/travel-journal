
import "@/dbConfig/dbConfig"

import { deleteJournalController, updateJournalController } from "@/controllers/journalController";


export const PATCH = updateJournalController
export const DELETE = deleteJournalController

