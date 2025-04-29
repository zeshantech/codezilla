import { NextRequest } from "next/server";
import { z } from "zod";
import { StatusCodes } from "@/constants/statusCodes";
import { ValidationException } from "./exceptions";

type ValidationTarget = "query" | "body" | "params" | "headers";

export interface ValidationErrorDetail {
  message: string;
  path: (string | number)[];
}

export async function validateRequest<T extends z.ZodType>(request: NextRequest, schema: T, target: ValidationTarget): Promise<z.infer<T>> {
  try {
    let data: unknown;

    switch (target) {
      case "query":
        const searchParams = request.nextUrl.searchParams;
        data = Object.fromEntries(searchParams.entries());
        break;
      case "body":
        data = await request.json();
        break;
      case "params":
        // For dynamic routes, params are typically handled by Next.js
        // This is a placeholder for future implementation
        data = {};
        break;
      case "headers":
        data = Object.fromEntries(request.headers.entries());
        break;
      default:
        throw new Error(`Invalid validation target: ${target}`);
    }

    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors = error.errors.map((err) => {
        const path = err.path[0]?.toString() || "";
        return path + " " + err.message;
      });
      throw new ValidationException(validationErrors);
    }
    throw error;
  }
}

export function createValidator<T extends z.ZodType>(schema: T, target: ValidationTarget) {
  return async (request: NextRequest) => {
    return validateRequest(request, schema, target);
  };
}

// Helper function to create a response for validation errors
export function createValidationErrorResponse(errors: ValidationErrorDetail[]) {
  return {
    data: {
      errors,
      message: "Validation failed",
    },
    status: StatusCodes.BAD_REQUEST,
  };
}
