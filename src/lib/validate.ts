// src/lib/validate.ts
import { ZodSchema, ZodError } from "zod";
import { BadRequestError } from "./errors";

// Define a type for validation errors
export interface ValidationError {
  path: string;
  message: string;
}

/**
 * Validates payload against a Zod schema
 * @param schema - Zod schema to validate against
 * @param payload - Unknown payload to validate
 * @returns Validated data of type T
 * @throws BadRequestError with validation details if validation fails
 */
export function validateBody<T>(schema: ZodSchema<T>, payload: unknown): T {
  // Handle null or undefined payload
  if (payload === null || payload === undefined) {
    throw new BadRequestError("Request body is required");
  }

  const result = schema.safeParse(payload);

  if (!result.success) {
    const formattedErrors: ValidationError[] = result.error.issues.map(err => ({
      path: err.path.length > 0 ? err.path.join(".") : "root",
      message: err.message
    }));

    // Since your BadRequestError only takes a message, we'll format the errors into the message
    const errorMessage = formatErrorMessage(formattedErrors);
    throw new BadRequestError(errorMessage);
  }

  return result.data;
}

/**
 * Format validation errors into a readable string
 */
function formatErrorMessage(errors: ValidationError[]): string {
  if (errors.length === 0) return "Validation failed";
  
  if (errors.length === 1) {
    return `Validation failed: ${errors[0].path} - ${errors[0].message}`;
  }
  
  const errorDetails = errors.map(err => `  • ${err.path}: ${err.message}`).join('\n');
  return `Validation failed:\n${errorDetails}`;
}

/**
 * Alternative version that includes validation details in a custom property
 * if you want to preserve structured error information
 */
export function validateBodyDetailed<T>(schema: ZodSchema<T>, payload: unknown): T {
  if (payload === null || payload === undefined) {
    const error = new BadRequestError("Request body is required");
    (error as any).validationErrors = [{ path: "body", message: "Request body is required" }];
    throw error;
  }

  const result = schema.safeParse(payload);

  if (!result.success) {
    const formattedErrors: ValidationError[] = result.error.issues.map(err => ({
      path: err.path.length > 0 ? err.path.join(".") : "root",
      message: err.message
    }));

    const errorMessage = formatErrorMessage(formattedErrors);
    const error = new BadRequestError(errorMessage);
    
    // Attach validation details to the error object
    (error as any).validationErrors = formattedErrors;
    throw error;
  }

  return result.data;
}

/**
 * Async version for schemas with async refinements
 */
export async function validateBodyAsync<T>(
  schema: ZodSchema<T>, 
  payload: unknown
): Promise<T> {
  if (payload === null || payload === undefined) {
    throw new BadRequestError("Request body is required");
  }

  const result = await schema.safeParseAsync(payload);

  if (!result.success) {
    const formattedErrors: ValidationError[] = result.error.issues.map(err => ({
      path: err.path.length > 0 ? err.path.join(".") : "root",
      message: err.message
    }));

    const errorMessage = formatErrorMessage(formattedErrors);
    throw new BadRequestError(errorMessage);
  }

  return result.data;
}