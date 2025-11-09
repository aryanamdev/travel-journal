import { CreateJournalInput } from "@/types/journal";
import { NextRequest, NextResponse } from "next/server";
import Journal from "@/models/journalModel";
import { connect } from "@/dbConfig/dbConfig";

connect()

export async function POST(request: NextRequest){
    try {
        const journalData: CreateJournalInput = await request.json()

        if(!journalData?.title){
            throw new Error("Title is required")
        } 

        if(journalData?.title.length < 2){
            throw new Error("Title must be more than 2 characters")
        }

        const journal = await Journal.create(journalData)

        return NextResponse.json({
            data: journal,
            success: true,
            message: "Successfully created record"
        })

    } catch (error: any) {
        return NextResponse.json({
            message: error.message,
            success: false
        })
    }
}   