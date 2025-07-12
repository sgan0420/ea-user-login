import { UserRecord } from "../db/UserModel";

/**
 * User data without password for responses
 */
export type UserResponseData = Omit<UserRecord, "password">;

/**
 * Base service response model
 */
export interface ServiceResponse<T = any> {
  data?: T;
  message: string;
  success: boolean;
}

// ====== INPUT MODELS ======

/**
 * User registration input model
 */
export interface RegisterUserInput {
  email: string;
  username: string;
  password: string;
}

/**
 * Login initiation input model
 */
export interface InitiateLoginInput {
  identifier: string; // username or email
  password: string;
}

/**
 * Email verification input model
 */
export interface VerifyEmailInput {
  email: string;
  otpCode: string;
}

/**
 * Complete login input model
 */
export interface CompleteLoginInput {
  userId: string;
  otpCode: string;
}

/**
 * Resend OTP input model
 */
export interface ResendOtpInput {
  email: string;
}

// ====== OUTPUT MODELS ======

/**
 * User registration response model
 */
export interface RegisterUserResponse {
  user: UserResponseData;
  message: string;
}

/**
 * Email verification and login response model
 */
export interface VerifyEmailAndLoginResponse {
  user: UserResponseData;
  message: string;
}

/**
 * Login initiation response model
 */
export interface InitiateLoginResponse {
  userId: string;
  message: string;
  otpSent: boolean;
  requiresVerification?: boolean;
  user?: UserResponseData;
}

/**
 * Complete login response model
 */
export interface CompleteLoginResponse {
  user: UserResponseData;
  message: string;
}

/**
 * Resend OTP response model
 */
export interface ResendOtpResponse {
  message: string;
}
