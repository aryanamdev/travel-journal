// src/lib/response.ts
export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T | null;
  errors?: unknown;
};

export function successResponse<T = unknown>(data: T | null, message = "OK") {
  return { success: true, message, data } as ApiResponse<T>;
}

export function errorResponse(message = "Error", errors: unknown = null) {
  return { success: false, message, errors } as ApiResponse<null>;
}
