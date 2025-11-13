import "@/dbConfig/dbConfig"


import { 
    createJournalController, 
    deleteJournalController, 
    getJournalsController,
    updateJournalController 
} from "@/controllers/journalController";


export { 
    createJournalController as POST,  
    deleteJournalController as DELETE, 
    updateJournalController as PATCH, 
    getJournalsController as GET
};

