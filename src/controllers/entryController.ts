// src/controllers/entryController.ts

import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/lib/errors";
import { successResponse, errorResponse } from "@/lib/response";
import { validateBody } from "@/lib/validate";
import { CreateEntrySchema, UpdateEntrySchema } from "@/schemas/entry";
import { withAuth } from "@/lib/withAuth";
import { entryService } from "@/services/entryService";

// POST /api/v2/entries
export const createEntryController = withAuth(async (req, user) => {
  try {
    const token = req.cookies.get("token")?.value || "";
    if (!token) throw new AppError("Unauthorized", 401);

    const body = await req.json();
    const payload = validateBody(CreateEntrySchema, body);

    // Always trust authenticated user over client-provided authorId
    const created = await entryService.create(user.id, payload);

    return NextResponse.json(successResponse(created, "Entry created"), {
      status: 201,
    });
  } catch (err: any) {
    if (err instanceof AppError) {
      return NextResponse.json(errorResponse(err.message), {
        status: err.statusCode,
      });
    }
    return NextResponse.json(errorResponse(err?.message || "Internal Server Error"), {
      status: 500,
    });
  }
});

// GET /api/v2/entries?journalId=...
export const getEntriesController = withAuth(async (req, user) => {
  try {
    const token = req.cookies.get("token")?.value || "";
    if (!token) throw new AppError("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const journalId = searchParams.get("journalId") || undefined;

    const entries = await entryService.getAll(user.id, journalId ?? undefined);

    return NextResponse.json(successResponse(entries, "Entries fetched"), {
      status: 200,
    });
  } catch (err: any) {
    if (err instanceof AppError) {
      return NextResponse.json(errorResponse(err.message), {
        status: err.statusCode,
      });
    }
    return NextResponse.json(errorResponse(err?.message || "Internal Server Error"), {
      status: 500,
    });
  }
});

// GET /api/v2/entries/[id]
export const getEntryController = withAuth(async (_req, user, { params }) => {
  try {
    const { id } = params;
    const entry = await entryService.getById(id, user.id);

    return NextResponse.json(successResponse(entry, "Entry fetched"), {
      status: 200,
    });
  } catch (err: any) {
    if (err instanceof AppError) {
      return NextResponse.json(errorResponse(err.message), {
        status: err.statusCode,
      });
    }
    return NextResponse.json(errorResponse(err?.message || "Internal Server Error"), {
      status: 500,
    });
  }
});

// PATCH /api/v2/entries/[id]
export const updateEntryController = withAuth(async (req, user, { params }) => {
  try {
    const token = req.cookies.get("token")?.value || "";
    if (!token) throw new AppError("Unauthorized", 401);

    const { id } = params;
    const body = await req.json();
    const payload = validateBody(UpdateEntrySchema, body);

    const updated = await entryService.update(id, user.id, payload);

    return NextResponse.json(successResponse(updated, "Entry updated"), {
      status: 200,
    });
  } catch (err: any) {
    if (err instanceof AppError) {
      return NextResponse.json(errorResponse(err.message), {
        status: err.statusCode,
      });
    }
    return NextResponse.json(errorResponse(err?.message || "Internal Server Error"), {
      status: 500,
    });
  }
});

// DELETE /api/v2/entries/[id]
export const deleteEntryController = withAuth(async (_req, user, { params }) => {
  try {
    const { id } = params;
    const deleted = await entryService.remove(id, user.id);

    return NextResponse.json(successResponse(deleted, "Entry deleted"), {
      status: 200,
    });
  } catch (err: any) {
    if (err instanceof AppError) {
      return NextResponse.json(errorResponse(err.message), {
        status: err.statusCode,
      });
    }
    return NextResponse.json(errorResponse(err?.message || "Internal Server Error"), {
      status: 500,
    });
  }
});