import { StatusCodes } from "@/constants/statusCodes";

// Base application error class
export class ApiException extends Error {
  public readonly statusCode: number;
  public readonly message: string;

  constructor(message: string, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 Bad Request - Invalid input or parameters
export class BadRequestException extends ApiException {
  constructor(message: string = "Bad request") {
    super(message, StatusCodes.BAD_REQUEST);
  }
}

// 401 Unauthorized - Authentication required
export class UnauthorizedException extends ApiException {
  constructor(message: string = "Authentication failed") {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

// 403 Forbidden - Authenticated but not authorized
export class ForbiddenException extends ApiException {
  constructor(message: string = "Access forbidden") {
    super(message, StatusCodes.FORBIDDEN);
  }
}

// 404 Not Found - Resource not found
export class NotFoundException extends ApiException {
  constructor(message: string = "Resource not found") {
    super(message, StatusCodes.NOT_FOUND);
  }
}

// 409 Conflict - Resource conflict
export class ConflictException extends ApiException {
  constructor(message: string = "Resource conflict") {
    super(message, StatusCodes.CONFLICT);
  }
}

// 422 Unprocessable Entity - Validation errors
export class ValidationException extends ApiException {
  public readonly errors: string[];

  constructor(errors: string[], message: string = "Validation failed") {
    super(message, StatusCodes.UNPROCESSABLE_ENTITY);
    this.errors = errors;
  }
}

// 429 Too Many Requests - Rate limit exceeded
export class RateLimitException extends ApiException {
  constructor(message: string = "Rate limit exceeded") {
    super(message, StatusCodes.TOO_MANY_REQUESTS);
  }
}

// 500 Internal Server Error - Unexpected server error
export class InternalServerException extends ApiException {
  constructor(message: string = "Internal server error") {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

// 502 Bad Gateway - Invalid response from upstream server
export class BadGatewayException extends ApiException {
  constructor(message: string = "Bad gateway") {
    super(message, StatusCodes.BAD_GATEWAY);
  }
}

// 503 Service Unavailable - Server temporarily unavailable
export class ServiceUnavailableException extends ApiException {
  constructor(message: string = "Service unavailable") {
    super(message, StatusCodes.SERVICE_UNAVAILABLE);
  }
}

// 504 Gateway Timeout - Upstream server timeout
export class GatewayTimeoutException extends ApiException {
  constructor(message: string = "Gateway timeout") {
    super(message, StatusCodes.GATEWAY_TIMEOUT);
  }
}

// Database related errors
export class DatabaseException extends ApiException {
  constructor(message: string = "Database operation failed") {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
