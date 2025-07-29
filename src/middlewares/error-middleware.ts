import { Request, Response, NextFunction } from "express";
import {
  ValidationError,
  UniqueConstraintError,
  DatabaseError,
} from "sequelize";
import { Logger, ResponseHandler } from "@/utils";

// Custom error class
class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Custom ErrorHandler class
class ErrorHandler extends Error {
  public code: number;

  constructor(message: string, code: number = 500) {
    super(message);
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handling middleware
const errorHandler = (
  error:
    | AppError
    | Error
    | ValidationError
    | UniqueConstraintError
    | DatabaseError
    | ErrorHandler,
  req: Request,
  res: Response,
): void => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }
  // Handle Sequelize validation errors
  else if (error instanceof ValidationError) {
    const errors = error.errors.map((err) => err.message);
    message = `Invalid input data. ${errors.join(". ")}`;
    statusCode = 400; // Bad Request
  }
  // Handle Sequelize unique constraint errors
  else if (error instanceof UniqueConstraintError) {
    const errors = error.errors.map((err) => err.message);
    message = `Duplicate field value: ${errors.join(". ")}`;
    statusCode = 400; // Bad Request
  }
  // Handle Sequelize database errors (e.g., type errors, query syntax errors)
  else if (error instanceof DatabaseError) {
    message = `Database error: ${error.message}`;
    statusCode = 500; // Internal Server Error
  }
  // Custom error handler
  else if (error instanceof ErrorHandler) {
    message = error.message;
    statusCode = error.code;
  } else if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid Data Format";
  } else if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid Token";
  } else if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token Expired";
  }

  // Log the error
  Logger.error(`Unhandled Error: ${message}`, {
    error: error.stack,
    statusCode,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  // Send error response
  ResponseHandler.error(res, message, statusCode, error);
};

// 404 handler
const notFoundHandler = (req: Request, res: Response): void => {
  const message = `Route ${req.originalUrl} not found`;
  ResponseHandler.error(res, message, 404);
};

// Async error wrapper
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Process handlers for uncaught exceptions
const handleUncaughtException = (): void => {
  process.on("uncaughtException", (error: Error) => {
    Logger.error("Uncaught Exception - Shutting down gracefully", error);
    process.exit(1);
  });
};

const handleUnhandledRejection = (): void => {
  process.on(
    "unhandledRejection",
    (reason: Error | unknown, promise: Promise<unknown>) => {
      Logger.error("Unhandled Rejection - Shutting down gracefully", {
        reason,
        promise,
      });
      process.exit(1);
    },
  );
};

export {
  AppError,
  ErrorHandler,
  errorHandler,
  notFoundHandler,
  asyncHandler,
  handleUncaughtException,
  handleUnhandledRejection,
};
