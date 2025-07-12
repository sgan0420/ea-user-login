import { Request, Response, NextFunction } from "express";
import {
  registerUser,
  verifyEmailAndLogin,
  initiateLogin,
  completeLogin,
  resendVerificationOtp,
  resendLoginOtp,
} from "../services/userService";

/**
 * Authentication Controller
 * Handles HTTP requests and responses for user authentication
 */

/**
 * Register a new user
 * POST /api/auth/register
 */
export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, username, password } = req.body;

    const result = await registerUser({ email, username, password });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify email with OTP and auto-login
 * POST /api/auth/verify-email
 */
export const verifyEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otpCode } = req.body;

    const result = await verifyEmailAndLogin(email, otpCode);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Initiate login process
 * POST /api/auth/login
 */
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    const result = await initiateLogin(identifier, password);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Complete login with OTP verification
 * POST /api/auth/complete-login
 */
export const completeLoginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, otpCode } = req.body;

    const result = await completeLogin(userId, otpCode);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Resend verification OTP
 * POST /api/auth/resend-verification
 */
export const resendVerificationController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    const result = await resendVerificationOtp(email);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Resend login OTP
 * POST /api/auth/resend-login-otp
 */
export const resendLoginOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    const result = await resendLoginOtp(email);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
