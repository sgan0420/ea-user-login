import * as userDao from "../dao/userDao";
import { NewUser } from "../models/db/UserModel";
import {
  RegisterUserInput,
  RegisterUserResponse,
  VerifyEmailAndLoginResponse,
  InitiateLoginResponse,
  CompleteLoginResponse,
  ResendOtpResponse,
} from "../models/service/UserServiceModel";
import {
  createValidationError,
  createUserExistsError,
  createDatabaseError,
  createInvalidCredentialsError,
  createNotFoundError,
  createUnauthorizedError,
} from "../utils/errorUtils";
import bcrypt from "bcrypt";
import { generateAndSaveOtp, verifyOtp } from "./otpService";

/**
 * User Service Layer
 * Handles business logic and validation for user operations
 *
 * Flow:
 * 1. Registration -> OTP verification -> Auto login
 * 2. Login -> OTP verification -> Success
 */

/**
 * Registers a new user and sends verification OTP
 * @param userData - User registration data
 * @returns Promise with user data and OTP info
 */
export const registerUser = async (
  userData: RegisterUserInput
): Promise<RegisterUserResponse> => {
  // Validation
  if (!userData.email || !userData.email.trim()) {
    throw createValidationError("Email is required");
  }

  if (!userData.username || !userData.username.trim()) {
    throw createValidationError("Username is required");
  }

  if (!userData.password || userData.password.length < 8) {
    throw createValidationError("Password must be at least 8 characters");
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.email)) {
    throw createValidationError("Invalid email format");
  }

  // Username validation (no special characters, alphanumeric only)
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(userData.username)) {
    throw createValidationError(
      "Username must be 3-20 characters, alphanumeric and underscore only"
    );
  }

  // Check if email exists
  const { exists: emailExists, error: emailCheckError } =
    await userDao.emailExists(userData.email);
  if (emailCheckError) {
    throw createDatabaseError("Failed to check email availability");
  }
  if (emailExists) {
    throw createUserExistsError("Email");
  }

  // Check if username exists
  const { exists: usernameExists, error: usernameCheckError } =
    await userDao.usernameExists(userData.username);
  if (usernameCheckError) {
    throw createDatabaseError("Failed to check username availability");
  }
  if (usernameExists) {
    throw createUserExistsError("Username");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 12);

  // Create user
  const newUser: NewUser = {
    email: userData.email.toLowerCase().trim(),
    username: userData.username.toLowerCase().trim(),
    password: hashedPassword,
    is_verified: false,
  };

  const { data: createdUser, error: createError } = await userDao.createUser(
    newUser
  );
  if (createError || !createdUser) {
    throw createDatabaseError("Failed to create user");
  }

  // Generate and save OTP
  const otpCode = await generateAndSaveOtp(createdUser.id, "register");

  // TODO: Send OTP via email service
  // await emailService.sendVerificationOtp(createdUser.email, otpCode);

  return {
    user: createdUser,
    message:
      "Registration successful. Please check your email for verification code.",
  };
};

/**
 * Verifies email with OTP and logs user in automatically
 * @param email - User's email
 * @param otpCode - OTP code
 * @returns Promise with user data and success message
 */
export const verifyEmailAndLogin = async (
  email: string,
  otpCode: string
): Promise<VerifyEmailAndLoginResponse> => {
  // Validation
  if (!email || !email.trim()) {
    throw createValidationError("Email is required");
  }

  if (!otpCode || !otpCode.trim()) {
    throw createValidationError("Verification code is required");
  }

  // Find user
  const { data: user, error: findError } = await userDao.findUserByEmail(email);
  if (findError) {
    throw createDatabaseError("Failed to find user");
  }
  if (!user) {
    throw createNotFoundError("User");
  }

  if (user.is_verified) {
    throw createValidationError("User is already verified");
  }

  // Verify OTP
  const otpValid = await verifyOtp(user.id, otpCode, "register");
  if (!otpValid) {
    throw createInvalidCredentialsError();
  }

  // Mark user as verified
  const { success: verifySuccess, error: verifyError } =
    await userDao.markUserVerified(user.id);
  if (verifyError || !verifySuccess) {
    throw createDatabaseError("Failed to verify user");
  }

  // Get updated user profile
  const { data: updatedUser, error: profileError } =
    await userDao.getUserProfile(user.id);
  if (profileError || !updatedUser) {
    throw createDatabaseError("Failed to get user profile");
  }

  return {
    user: updatedUser,
    message: "Email verified successfully. You are now logged in.",
  };
};

/**
 * Initiates login process by sending OTP to user's email
 * @param identifier - Username or email
 * @param password - User's password
 * @returns Promise with user data and success message
 */
export const initiateLogin = async (
  identifier: string,
  password: string
): Promise<InitiateLoginResponse> => {
  // Validation
  if (!identifier || !identifier.trim()) {
    throw createValidationError("Username or email is required");
  }

  if (!password || !password.trim()) {
    throw createValidationError("Password is required");
  }

  // Find user
  const { data: user, error: findError } = await userDao.findUserByIdentifier(
    identifier
  );
  if (findError) {
    throw createDatabaseError("Failed to find user");
  }
  if (!user) {
    throw createInvalidCredentialsError();
  }

  // Verify password
  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) {
    throw createInvalidCredentialsError();
  }

  // If user is not verified, send verification OTP
  if (!user.is_verified) {
    const otpCode = await generateAndSaveOtp(user.id, "register");

    // TODO: Send OTP via email service
    // await emailService.sendVerificationOtp(user.email, otpCode);

    return {
      userId: user.id,
      message: "Email not verified. Verification code sent to your email.",
      otpSent: true,
      requiresVerification: true,
    };
  }

  // Generate and save login OTP
  const otpCode = await generateAndSaveOtp(user.id, "login");

  // TODO: Send OTP via email service
  // await emailService.sendLoginOtp(user.email, otpCode);

  const { password: _, ...userWithoutPassword } = user;

  return {
    userId: user.id,
    user: userWithoutPassword,
    message: "Login code sent to your email. Please verify to complete login.",
    otpSent: true,
  };
};

/**
 * Completes login process with OTP verification
 * @param userId - User's ID
 * @param otpCode - OTP code
 * @returns Promise with user data and success message
 */
export const completeLogin = async (
  userId: string,
  otpCode: string
): Promise<CompleteLoginResponse> => {
  // Validation
  if (!userId || !userId.trim()) {
    throw createValidationError("User ID is required");
  }

  if (!otpCode || !otpCode.trim()) {
    throw createValidationError("Login code is required");
  }

  // Find user
  const { data: user, error: findError } = await userDao.findUserById(userId);
  if (findError) {
    throw createDatabaseError("Failed to find user");
  }
  if (!user) {
    throw createNotFoundError("User");
  }

  // Verify OTP
  const otpValid = await verifyOtp(userId, otpCode, "login");
  if (!otpValid) {
    throw createInvalidCredentialsError();
  }

  // Get user profile
  const { data: userProfile, error: profileError } =
    await userDao.getUserProfile(userId);
  if (profileError || !userProfile) {
    throw createDatabaseError("Failed to get user profile");
  }

  return {
    user: userProfile,
    message: "Login successful",
  };
};

/**
 * Resends verification OTP
 * @param email - User's email
 * @returns Promise with success message
 */
export const resendVerificationOtp = async (
  email: string
): Promise<ResendOtpResponse> => {
  // Validation
  if (!email || !email.trim()) {
    throw createValidationError("Email is required");
  }

  // Find user
  const { data: user, error: findError } = await userDao.findUserByEmail(email);
  if (findError) {
    throw createDatabaseError("Failed to find user");
  }
  if (!user) {
    throw createNotFoundError("User");
  }

  if (user.is_verified) {
    throw createValidationError("User is already verified");
  }

  // Generate new OTP
  const otpCode = await generateAndSaveOtp(user.id, "register");

  // TODO: Send OTP via email service
  // await emailService.sendVerificationOtp(user.email, otpCode);

  return {
    message: "Verification code sent to your email",
  };
};

/**
 * Resends login OTP
 * @param email - User's email
 * @returns Promise with success message
 */
export const resendLoginOtp = async (
  email: string
): Promise<ResendOtpResponse> => {
  // Validation
  if (!email || !email.trim()) {
    throw createValidationError("Email is required");
  }

  // Find user
  const { data: user, error: findError } = await userDao.findUserByEmail(email);
  if (findError) {
    throw createDatabaseError("Failed to find user");
  }
  if (!user) {
    throw createNotFoundError("User");
  }

  // Generate new OTP
  const otpCode = await generateAndSaveOtp(user.id, "login");

  // TODO: Send OTP via email service
  // await emailService.sendLoginOtp(user.email, otpCode);

  return {
    message: "Login code sent to your email",
  };
};
