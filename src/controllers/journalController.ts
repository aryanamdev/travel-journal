// src/controllers/journalController.ts

import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/lib/errors";
import { successResponse, errorResponse } from "@/lib/response";
import { journalService } from "@/services/journalService";
import { validateBody } from "@/lib/validate";
import { JournalSchema } from "@/schemas/journal";

export const createJournalController = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("token")?.value || "";
    if (!token) throw new AppError("Unauthorized", 401);

    const userId = (req as any).user?.id; // if you attach user in middleware
    // If no middleware yet, decode token here

    const body = await req.json();
    const payload = validateBody(JournalSchema, body);

    const journal = await journalService.create(userId, payload);

    return NextResponse.json(successResponse(journal, "Journal created"), { status: 201 });
  } catch (err: any) {
    if (err instanceof AppError) {
      return NextResponse.json(errorResponse(err.message), { status: err.statusCode });
    }
    return NextResponse.json(errorResponse(err.message || "Internal Server Error"), { status: 500 });
  }
};

export const getJournalsController = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("token")?.value || "";
    if (!token) throw new AppError("Unauthorized", 401);

    const userId = (req as any).user?.id;

    const journals = await journalService.getAll(userId);

    return NextResponse.json(successResponse(journals, "Journals fetched"), { status: 200 });
  } catch (err: any) {
    if (err instanceof AppError) {
      return NextResponse.json(errorResponse(err.message), { status: err.statusCode });
    }
    return NextResponse.json(errorResponse(err.message || "Internal Server Error"), { status: 500 });
  }
};

export const updateJournalController = async (req: NextRequest, { params }: any) => {
  try {
    const token = req.cookies.get("token")?.value || "";
    if (!token) throw new AppError("Unauthorized", 401);

    const userId = (req as any).user?.id;
    const { id } = params;

    const body = await req.json();
    const journal = await journalService.update(id, userId, body);

    return NextResponse.json(successResponse(journal, "Journal updated"), { status: 200 });
  } catch (err: any) {
    if (err instanceof AppError) {
      return NextResponse.json(errorResponse(err.message), { status: err.statusCode });
    }
    return NextResponse.json(errorResponse(err.message || "Internal Server Error"), { status: 500 });
  }
};

export const deleteJournalController = async (_req: NextRequest, { params }: any) => {
  try {
    const token = _req.cookies.get("token")?.value || "";
    if (!token) throw new AppError("Unauthorized", 401);

    const userId = (_req as any).user?.id;
    const { id } = params;

    const journal = await journalService.remove(id, userId);

    return NextResponse.json(successResponse(journal, "Journal deleted"), { status: 200 });
  } catch (err: any) {
    if (err instanceof AppError) {
      return NextResponse.json(errorResponse(err.message), { status: err.statusCode });
    }
    return NextResponse.json(errorResponse(err.message || "Internal Server Error"), { status: 500 });
  }
};
