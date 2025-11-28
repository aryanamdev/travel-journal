import { describe, it, expect, vi, beforeEach } from "vitest";
import { AppError, BadRequestError, UnauthorizedError } from "@/lib/errors";
import { successResponse } from "@/lib/response";

import { registerController, loginController, logoutController, verifyController, meController } from "@/controllers/authController";
import { authService } from "@/services/authService";
import { validateBody } from "@/lib/validate";

vi.mock("@/services/authService", () => ({
  authService: {
    register: vi.fn(),
    login: vi.fn(),
    verify: vi.fn(),
    me: vi.fn(),
  },
}));

vi.mock("@/lib/validate", () => ({
  validateBody: vi.fn(),
}));

const mockedAuthService = authService as unknown as {
  register: ReturnType<typeof vi.fn>;
  login: ReturnType<typeof vi.fn>;
  verify: ReturnType<typeof vi.fn>;
  me: ReturnType<typeof vi.fn>;
};

const mockedValidateBody = validateBody as unknown as ReturnType<typeof vi.fn>;

const createJsonReq = (body: any) => ({
  json: vi.fn().mockResolvedValue(body),
  cookies: {
    get: vi.fn().mockReturnValue({ value: "token" }),
  },
});

const createReqWithToken = (token: string | undefined) => ({
  cookies: {
    get: vi.fn().mockReturnValue(token ? { value: token } : undefined),
  },
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("registerController", () => {
  it("returns 201 and success payload on successful registration", async () => {
    const body = { email: "a@test.com", fullName: "User", password: "password123" };
    const user = { id: "1", email: body.email };

    mockedValidateBody.mockReturnValue(body);
    mockedAuthService.register.mockResolvedValue(user);

    const req = createJsonReq(body);
    const res = await registerController(req as any);

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toEqual(user);
  });

  it("maps AppError to its status code", async () => {
    const body = { email: "bad", fullName: "x", password: "short" };
    const err = new BadRequestError("Invalid payload");

    mockedValidateBody.mockImplementation(() => {
      throw err;
    });

    const req = createJsonReq(body);
    const res = await registerController(req as any);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe("Invalid payload");
  });
});

describe("loginController", () => {
  it("sets token cookie and returns user on success", async () => {
    const body = { email: "a@test.com", password: "password123" };
    const user = { id: "1", email: body.email };

    mockedValidateBody.mockReturnValue(body);
    mockedAuthService.login.mockResolvedValue({ token: "jwt-token", user });

    const req = createJsonReq(body);
    const res = await loginController(req as any);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toEqual(user);
    const setCookieHeader = res.headers.get("set-cookie");
    expect(setCookieHeader).toContain("token=");
  });

  it("returns appropriate status for AppError", async () => {
    const body = { email: "a@test.com", password: "wrong" };
    const err = new UnauthorizedError("Incorrect email or password");

    mockedValidateBody.mockReturnValue(body);
    mockedAuthService.login.mockRejectedValue(err);

    const req = createJsonReq(body);
    const res = await loginController(req as any);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe("Incorrect email or password");
  });
});

describe("logoutController", () => {
  it("always returns 200 and clears token cookie", async () => {
    const req = {} as any;
    const res = await logoutController(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    const setCookieHeader = res.headers.get("set-cookie");
    expect(setCookieHeader).toContain("token=");
  });
});

describe("verifyController", () => {
  it("returns already verified message when service indicates so", async () => {
    const body = { token: "token" };
    mockedValidateBody.mockReturnValue(body);
    mockedAuthService.verify.mockResolvedValue({ alreadyVerified: true });

    const req = createJsonReq(body);
    const res = await verifyController(req as any);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.message).toBe("User already verified");
  });

  it("returns verified successfully message when newly verified", async () => {
    const body = { token: "token" };
    mockedValidateBody.mockReturnValue(body);
    mockedAuthService.verify.mockResolvedValue({ alreadyVerified: false });

    const req = createJsonReq(body);
    const res = await verifyController(req as any);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.message).toBe("User verified successfully");
  });
});

describe("meController", () => {
  it("returns current user when authService.me succeeds", async () => {
    const token = "jwt-token";
    const me = { id: "1", email: "a@test.com" };

    mockedAuthService.me.mockResolvedValue({ success: true, user: me });

    const req = {
      cookies: {
        get: vi.fn().mockReturnValue({ value: token }),
      },
    } as any;

    const res = await meController(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toEqual(me);
  });

  it("maps AppError from authService.me to status code", async () => {
    const token = "bad-token";
    const err = new UnauthorizedError("Invalid token");

    mockedAuthService.me.mockRejectedValue(err);

    const req = {
      cookies: {
        get: vi.fn().mockReturnValue({ value: token }),
      },
    } as any;

    const res = await meController(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toBe("Invalid token");
  });
});
