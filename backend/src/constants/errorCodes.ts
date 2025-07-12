export const ERROR_CODES = {
  // Generic
  INTERNAL_SERVER_ERROR: { code: 1000, status: 500 },

  // Auth-related
  UNAUTHORIZED: { code: 1001, status: 401 },
  INVALID_CREDENTIALS: { code: 1002, status: 401 },
  USER_NOT_VERIFIED: { code: 1003, status: 403 },

  // User-related
  USER_ALREADY_EXISTS: { code: 2001, status: 409 },
  USER_NOT_FOUND: { code: 2002, status: 404 },

  // OTP-related
  OTP_INVALID: { code: 3001, status: 401 },
  OTP_EXPIRED: { code: 3002, status: 422 },
  OTP_ALREADY_USED: { code: 3003, status: 409 },

  // Input-related
  BAD_REQUEST: { code: 4000, status: 400 },
  VALIDATION_ERROR: { code: 4001, status: 422 },

  // Database-related
  DATABASE_ERROR: { code: 5000, status: 500 },

  // Request/Response errors (for middleware)
  INVALID_JSON: { code: 6001, status: 400 },
  ROUTE_NOT_FOUND: { code: 6002, status: 404 },
  EXPRESS_VALIDATION_ERROR: { code: 6003, status: 400 },
  JOI_VALIDATION_ERROR: { code: 6004, status: 400 },
} as const;

// External library error names (to avoid magic strings)
export const EXTERNAL_ERROR_NAMES = {
  VALIDATION_ERROR: "ValidationError",
  SYNTAX_ERROR: "SyntaxError",
} as const;

export type ErrorCodeKey = keyof typeof ERROR_CODES;
export type ErrorCode = (typeof ERROR_CODES)[ErrorCodeKey];
