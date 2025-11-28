import { describe, it, expect, vi, beforeEach } from "vitest";
import { AppError, BadRequestError, NotFoundError, UnauthorizedError } from "@/lib/errors";
import { createEntryController, getEntriesController, getEntryController, updateEntryController, deleteEntryController } from "@/controllers/entryController";
import { entryService } from "@/services/entryService";
import { validateBody } from "@/lib/validate";

vi.mock("@/lib/withAuth", () => ({
  withAuth: (handler: any) => handler,
}));

vi.mock("@/services/entryService", () => ({
  entryService: {
    create: vi.fn(),
    getAll: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock("@/lib/validate", () => ({
  validateBody: vi.fn(),
}));

const mockedEntryService = entryService as unknown as {
  create: ReturnType<typeof vi.fn>;
  getAll: ReturnType<typeof vi.fn>;
  getById: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
};

const mockedValidateBody = validateBody as unknown as ReturnType<typeof vi.fn>;

const createReq = (body: any = {}, extra: Partial<any> = {}) => ({
  cookies: {
    get: vi.fn().mockReturnValue({ value: "token" }),
  },
  json: vi.fn().mockResolvedValue(body),
  url: "http://localhost/api/v2/entries",
  ...extra,
});

const user = { id: "user-id" } as any;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createEntryController", () => {
  it("creates entry and returns 201", async () => {
    const body = { title: "Entry 1", journalId: "j1", authorId: "ignored" };
    const created = { id: "e1", ...body, authorId: user.id };

    mockedValidateBody.mockReturnValue(body);
    mockedEntryService.create.mockResolvedValue(created);

    const req = createReq(body);
    const res = await createEntryController(req as any, user);

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toEqual(created);
    expect(mockedEntryService.create).toHaveBeenCalledWith(user.id, body);
  });

  it("returns 401 when no token cookie", async () => {
    const body = { title: "Entry 1", journalId: "j1" };
    const req = createReq(body, {
      cookies: { get: vi.fn().mockReturnValue(undefined) },
    });

    const res = await createEntryController(req as any, user);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe("Unauthorized");
  });
});

describe("getEntriesController", () => {
  it("returns entries, optionally filtered by journalId", async () => {
    const entries = [{ id: "e1" }, { id: "e2" }];
    mockedEntryService.getAll.mockResolvedValue(entries);

    const req = createReq({}, { url: "http://localhost/api/v2/entries?journalId=j1" });
    const res = await getEntriesController(req as any, user);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toEqual(entries);
    expect(mockedEntryService.getAll).toHaveBeenCalledWith(user.id, "j1");
  });
});

describe("getEntryController", () => {
  it("returns a single entry", async () => {
    const entry = { id: "e1" };
    mockedEntryService.getById.mockResolvedValue(entry);

    const req = createReq();
    const res = await getEntryController(req as any, user, { params: { id: "e1" } } as any);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toEqual(entry);
    expect(mockedEntryService.getById).toHaveBeenCalledWith("e1", user.id);
  });
});

describe("updateEntryController", () => {
  it("updates entry and returns 200", async () => {
    const body = { title: "Updated" };
    const updated = { id: "e1", title: "Updated" };

    mockedValidateBody.mockReturnValue(body);
    mockedEntryService.update.mockResolvedValue(updated);

    const req = createReq(body);
    const res = await updateEntryController(req as any, user, { params: { id: "e1" } } as any);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toEqual(updated);
    expect(mockedEntryService.update).toHaveBeenCalledWith("e1", user.id, body);
  });

  it("returns 401 when no token cookie", async () => {
    const body = { title: "Updated" };
    const req = createReq(body, {
      cookies: { get: vi.fn().mockReturnValue(undefined) },
    });

    const res = await updateEntryController(req as any, user, { params: { id: "e1" } } as any);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe("Unauthorized");
  });
});

describe("deleteEntryController", () => {
  it("deletes entry and returns 200", async () => {
    const deleted = { id: "e1" };
    mockedEntryService.remove.mockResolvedValue(deleted);

    const req = createReq();
    const res = await deleteEntryController(req as any, user, { params: { id: "e1" } } as any);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toEqual(deleted);
    expect(mockedEntryService.remove).toHaveBeenCalledWith("e1", user.id);
  });
});
