import * as otpDao from "../dao/otpDao";
import { NewOtp } from "../models/db/OtpModel";
import { OtpType } from "../models/common/OtpTypeModel";
import { generateOtpCode } from "../utils/otpUtils";
import { createDatabaseError } from "../utils/errorUtils";

/**
 * Generate a new OTP code, save it in the database, and return the code
 * @param userId - ID of the user
 * @param type - OTP type (register/login)
 * @param expiresInMinutes - Expiration time in minutes (default 10)
 */
export const generateAndSaveOtp = async (
  userId: string,
  type: OtpType,
  expiresInMinutes = 10
): Promise<string> => {
  const code = generateOtpCode();
  const expiresAt = new Date(
    Date.now() + expiresInMinutes * 60_000
  ).toISOString();

  const newOtp: NewOtp = { user_id: userId, code, type, expires_at: expiresAt };
  const { data, error } = await otpDao.createOtp(newOtp);
  if (error || !data) {
    throw createDatabaseError("Failed to generate OTP");
  }
  return code;
};

/**
 * Verify an OTP code and mark it as used
 * @param userId - ID of the user
 * @param code - OTP code to verify
 * @param type - OTP type (register/login)
 */
export const verifyOtp = async (
  userId: string,
  code: string,
  type: OtpType
): Promise<boolean> => {
  const { data: otp, error } = await otpDao.findValidOtp(userId, code, type);
  if (error || !otp) {
    return false;
  }

  const { success, error: markError } = await otpDao.markOtpAsUsed(otp.id);
  return success && !markError;
};
