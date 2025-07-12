import { Request, Response, NextFunction } from "express";
import { AppError } from "../types/errors";
import { ERROR_CODES, EXTERNAL_ERROR_NAMES } from "../constants/errorCodes";

/**
 * Global Error Handling Middleware
 * Catches and formats all errors thrown in the application
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // If response already sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle known AppError instances
  if (err instanceof AppError) {
    res.status(err.status).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
      },
    });
    return;
  }

  // Handle validation errors (e.g., from express-validator or joi)
  if (err.name === EXTERNAL_ERROR_NAMES.VALIDATION_ERROR) {
    res.status(ERROR_CODES.EXPRESS_VALIDATION_ERROR.status).json({
      success: false,
      error: {
        message: "Validation failed",
        code: ERROR_CODES.EXPRESS_VALIDATION_ERROR.code,
        details: err.details || err.message,
      },
    });
    return;
  }

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && "body" in err) {
    res.status(ERROR_CODES.INVALID_JSON.status).json({
      success: false,
      error: {
        message: "Invalid JSON format",
        code: ERROR_CODES.INVALID_JSON.code,
      },
    });
    return;
  }

  // Handle unexpected errors
  console.error("Unexpected error:", err);

  res.status(ERROR_CODES.INTERNAL_SERVER_ERROR.status).json({
    success: false,
    error: {
      message: "Internal server error",
      code: ERROR_CODES.INTERNAL_SERVER_ERROR.code,
    },
  });
};

/**
 * 404 Not Found Handler
 * Handles requests to non-existent routes
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(ERROR_CODES.ROUTE_NOT_FOUND.status).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.originalUrl} not found`,
      code: ERROR_CODES.ROUTE_NOT_FOUND.code,
    },
  });
};
