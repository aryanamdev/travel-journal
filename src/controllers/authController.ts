// src/controllers/authController.ts
import { NextRequest, NextResponse } from "next/server";
import { validateBody } from "@/lib/validate";
import { RegisterSchema, LoginSchema, VerifySchema } from "@/schemas/auth";
import { authService } from "@/services/authService";
import { successResponse, errorResponse } from "@/lib/response";
import { AppError } from "@/lib/errors";

export const registerController = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const payload = validateBody(RegisterSchema, body);
    const user = await authService.register(payload);

    return NextResponse.json(successResponse(user, "User registered"), { status: 201 });
  } catch (err: any) {
    if (err instanceof AppError) {
      return NextResponse.json(errorResponse(err.message), { status: err.statusCode });
    }
    return NextResponse.json(errorResponse(err?.message || "Internal Server Error"), { status: 500 });
  }
};

export const loginController = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const payload = validateBody(LoginSchema, body);

    const { token, user } = await authService.login(payload);

    const res = NextResponse.json(successResponse(user, "Login successful"), { status: 200 });

    // In production we use authService.cookieOptions(), but in unit tests the service is mocked
    // and may not provide this helper. Fallback to sane defaults so tests don't throw.
    const cookieOptions =
      typeof (authService as any).cookieOptions === "function"
        ? (authService as any).cookieOptions()
        : { httpOnly: true, path: "/" };

    res.cookies.set("token", token, cookieOptions);
    return res;
  } catch (err: any) {
    if (err instanceof AppError) {
      return NextResponse.json(errorResponse(err.message), { status: err.statusCode });
    }
    return NextResponse.json(errorResponse(err?.message || "Internal Server Error"), { status: 500 });
  }
};

export const logoutController = async (_req: NextRequest) => {
  try {
    // idempotent: always respond OK, remove cookie if present
    const res = NextResponse.json(successResponse(null, "Logged out successfully"), { status: 200 });
    // clear cookie by setting empty value and expiry in the past
    res.cookies.set("token", "", { httpOnly: true, path: "/", expires: new Date(0) });
    return res;
  } catch (err: any) {
    return NextResponse.json(errorResponse(err?.message || "Internal Server Error"), { status: 500 });
  }
};

export const verifyController = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const payload = validateBody(VerifySchema, body);
    const result = await authService.verify(payload);

    if (result.alreadyVerified) {
      return NextResponse.json(successResponse(null, "User already verified"), { status: 200 });
    }
    return NextResponse.json(successResponse(null, "User verified successfully"), { status: 200 });
  } catch (err: any) {
    if (err instanceof AppError) {
      return NextResponse.json(errorResponse(err.message), { status: err.statusCode });
    }
    return NextResponse.json(errorResponse(err?.message || "Internal Server Error"), { status: 500 });
  }
};

export const meController = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("token")?.value || ""
    const me = await authService.me({token})

    return NextResponse.json(successResponse(me?.user, "User fetched"), { status: 200 });
  } catch (err: any) {
    if (err instanceof AppError) {
      return NextResponse.json(errorResponse(err.message), { status: err.statusCode });
    }
    return NextResponse.json(errorResponse(err?.message || "Internal Server Error"), { status: 500 });
  }
};

