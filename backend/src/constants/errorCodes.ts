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
} as const;

export type ErrorCodeKey = keyof typeof ERROR_CODES;
export type ErrorCode = (typeof ERROR_CODES)[ErrorCodeKey];
