import crypto from "crypto";

/**
 * Generates a 6-digit OTP code
 * @returns 6-digit OTP string
 */
export const generateOtpCode = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};
