class RequestError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode: number,
    errors?: Record<string, string[]>
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends RequestError {
  constructor(
    message = "Validation Error",
    errors?: Record<string, string[]>
  ) {
    super(message, 400, errors);
  }
}

class UnauthorizedError extends RequestError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

class ForbiddenError extends RequestError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

class NotFoundError extends RequestError {
  constructor(message = "Resource Not Found") {
    super(message, 404);
  }
}

export {
  RequestError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
};