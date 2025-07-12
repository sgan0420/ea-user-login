import { AppError } from "../types/errors";
import { ERROR_CODES } from "../constants/errorCodes";

export const createValidationError = (message: string): AppError => {
  return new AppError(message, ERROR_CODES.VALIDATION_ERROR);
};

export const createNotFoundError = (
  resource: string = "Resource"
): AppError => {
  return new AppError(`${resource} not found`, ERROR_CODES.USER_NOT_FOUND);
};

export const createUnauthorizedError = (
  message: string = "Unauthorized"
): AppError => {
  return new AppError(message, ERROR_CODES.UNAUTHORIZED);
};

export const createInvalidCredentialsError = (): AppError => {
  return new AppError("Invalid credentials", ERROR_CODES.INVALID_CREDENTIALS);
};

export const createDatabaseError = (
  message: string = "Database error occurred"
): AppError => {
  return new AppError(message, ERROR_CODES.INTERNAL_SERVER_ERROR);
};

export const createUserExistsError = (field: string = "User"): AppError => {
  return new AppError(
    `${field} already exists`,
    ERROR_CODES.USER_ALREADY_EXISTS
  );
};

export const isAppError = (error: any): error is AppError => {
  return error instanceof AppError;
};

export const toAppError = (error: unknown): AppError => {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, ERROR_CODES.INTERNAL_SERVER_ERROR);
  }

  return new AppError(
    "An unknown error occurred",
    ERROR_CODES.INTERNAL_SERVER_ERROR
  );
};
