import { describe, it, expect, vi, beforeEach } from "vitest";
import { AppError, BadRequestError, UnauthorizedError, NotFoundError } from "@/lib/errors";
import { createJournalController, getJournalsController, updateJournalController, deleteJournalController } from "@/controllers/journalController";
import { journalService } from "@/services/journalService";
import { validateBody } from "@/lib/validate";
import { CreateJournalSchema } from "@/schemas/journal";

vi.mock("@/lib/withAuth", () => ({
  withAuth: (handler: any) => handler,
}));

vi.mock("@/services/journalService", () => ({
  journalService: {
    create: vi.fn(),
    getAll: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock("@/lib/validate", () => ({
  validateBody: vi.fn(),
}));

const mockedJournalService = journalService as unknown as {
  create: ReturnType<typeof vi.fn>;
  getAll: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
};

const mockedValidateBody = validateBody as unknown as ReturnType<typeof vi.fn>;

const createReq = (body: any = {}) => ({
  cookies: {
    get: vi.fn().mockReturnValue({ value: "token" }),
  },
  json: vi.fn().mockResolvedValue(body),
});

const user = { id: "user-id" } as any;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createJournalController", () => {
  it("creates journal and returns 201", async () => {
    const body = { title: "My Journal" };
    const created = { id: "j1", title: body.title };

    mockedValidateBody.mockReturnValue(body);
    mockedJournalService.create.mockResolvedValue(created);

    const req = createReq(body);
    const res = await createJournalController(req as any, user);

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toEqual(created);
    expect(mockedJournalService.create).toHaveBeenCalledWith(user.id, body);
  });

  it("maps AppError to its status code", async () => {
    const body = { title: "" };
    const err = new BadRequestError("Title is required");

    mockedValidateBody.mockReturnValue(body);
    mockedJournalService.create.mockRejectedValue(err);

    const req = createReq(body);
    const res = await createJournalController(req as any, user);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe("Title is required");
  });
});

describe("getJournalsController", () => {
  it("returns list of journals", async () => {
    const journals = [{ id: "j1" }, { id: "j2" }];
    mockedJournalService.getAll.mockResolvedValue(journals);

    const req = createReq();
    const res = await getJournalsController(req as any, user);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toEqual(journals);
    expect(mockedJournalService.getAll).toHaveBeenCalledWith(user.id);
  });
});

describe("updateJournalController", () => {
  it("updates journal and returns 200", async () => {
    const body = { title: "Updated" };
    const updated = { id: "j1", title: "Updated" };

    mockedJournalService.update.mockResolvedValue(updated);

    const req = createReq(body);
    const res = await updateJournalController(req as any, user, { params: { id: "j1" } } as any);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toEqual(updated);
    expect(mockedJournalService.update).toHaveBeenCalledWith("j1", user.id, body);
  });

  it("returns 404 when journal not found", async () => {
    const body = { title: "Updated" };
    const err = new NotFoundError("Journal not found");

    mockedJournalService.update.mockRejectedValue(err);

    const req = createReq(body);
    const res = await updateJournalController(req as any, user, { params: { id: "missing" } } as any);

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe("Journal not found");
  });
});

describe("deleteJournalController", () => {
  it("deletes journal and returns 200", async () => {
    const deleted = { id: "j1" };
    mockedJournalService.remove.mockResolvedValue(deleted);

    const req = createReq();
    const res = await deleteJournalController(req as any, user, { params: { id: "j1" } } as any);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toEqual(deleted);
    expect(mockedJournalService.remove).toHaveBeenCalledWith("j1", user.id);
  });
});
