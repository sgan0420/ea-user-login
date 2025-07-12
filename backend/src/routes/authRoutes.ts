import { Router } from "express";
import {
  registerController,
  verifyEmailController,
  loginController,
  completeLoginController,
  resendVerificationController,
  resendLoginOtpController,
} from "../controllers/authController";

const router = Router();

/**
 * Authentication Routes
 */

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * @body    { email: string, username: string, password: string }
 */
router.post("/register", registerController);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email with OTP and auto-login
 * @access  Public
 * @body    { email: string, otpCode: string }
 */
router.post("/verify-email", verifyEmailController);

/**
 * @route   POST /api/auth/login
 * @desc    Initiate login process (sends OTP)
 * @access  Public
 * @body    { identifier: string, password: string }
 */
router.post("/login", loginController);

/**
 * @route   POST /api/auth/complete-login
 * @desc    Complete login with OTP verification
 * @access  Public
 * @body    { userId: string, otpCode: string }
 */
router.post("/complete-login", completeLoginController);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend verification OTP
 * @access  Public
 * @body    { email: string }
 */
router.post("/resend-verification", resendVerificationController);

/**
 * @route   POST /api/auth/resend-login-otp
 * @desc    Resend login OTP
 * @access  Public
 * @body    { email: string }
 */
router.post("/resend-login-otp", resendLoginOtpController);

export default router;
