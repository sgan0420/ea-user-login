import supabase from "../config/supabaseClient";
import { NewUser, UserRecord } from "../models/db/UserModel";

/**
 * User Data Access Object
 * Handles all database operations related to users
 */

/**
 * Creates a new user in the database
 * @param user - User data to insert
 * @returns Promise with user data or database error
 */
export const createUser = async (
  user: NewUser
): Promise<{ data: Omit<UserRecord, "password"> | null; error: any }> => {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        ...user,
        is_verified: false, // Always false on creation
        created_at: new Date().toISOString(),
      },
    ])
    .select("id, username, email, is_verified, created_at")
    .single();

  return { data: data ?? null, error };
};

/**
 * Finds a user by email address
 * @param email - Email to search for
 * @returns Promise with user data or database error
 */
export const findUserByEmail = async (
  email: string
): Promise<{ data: UserRecord | null; error: any }> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase().trim())
    .maybeSingle();

  return { data: data ?? null, error };
};

/**
 * Finds a user by username
 * @param username - Username to search for
 * @returns Promise with user data or database error
 */
export const findUserByUsername = async (
  username: string
): Promise<{ data: UserRecord | null; error: any }> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username.toLowerCase().trim())
    .maybeSingle();

  return { data: data ?? null, error };
};

/**
 * Finds a user by ID
 * @param userId - User ID to search for
 * @returns Promise with user data or database error
 */
export const findUserById = async (
  userId: string
): Promise<{ data: UserRecord | null; error: any }> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  return { data: data ?? null, error };
};

/**
 * Finds a user by username or email (for login)
 * @param identifier - Username or email
 * @returns Promise with user data or database error
 */
export const findUserByIdentifier = async (
  identifier: string
): Promise<{ data: UserRecord | null; error: any }> => {
  const cleanIdentifier = identifier.toLowerCase().trim();

  // Check if identifier contains @ to determine if it's email or username
  const isEmail = cleanIdentifier.includes("@");

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq(isEmail ? "email" : "username", cleanIdentifier)
    .maybeSingle();

  return { data: data ?? null, error };
};

/**
 * Checks if email already exists in the database
 * @param email - Email to check
 * @returns Promise with boolean result or database error
 */
export const emailExists = async (
  email: string
): Promise<{ exists: boolean; error: any }> => {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", email.toLowerCase().trim())
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "no rows returned"
    return { exists: false, error };
  }

  return { exists: !!data, error: null };
};

/**
 * Checks if username already exists in the database
 * @param username - Username to check
 * @returns Promise with boolean result or database error
 */
export const usernameExists = async (
  username: string
): Promise<{ exists: boolean; error: any }> => {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("username", username.toLowerCase().trim())
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "no rows returned"
    return { exists: false, error };
  }

  return { exists: !!data, error: null };
};

/**
 * Marks a user as verified
 * @param userId - ID of the user to verify
 * @returns Promise with success status or database error
 */
export const markUserVerified = async (
  userId: string
): Promise<{ success: boolean; error: any }> => {
  const { error } = await supabase
    .from("users")
    .update({
      is_verified: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  return { success: !error, error };
};

/**
 * Gets user profile information (excluding sensitive data)
 * @param userId - ID of the user
 * @returns Promise with user profile or database error
 */
export const getUserProfile = async (
  userId: string
): Promise<{ data: Omit<UserRecord, "password"> | null; error: any }> => {
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, username, email, is_verified, created_at, last_login_at, updated_at"
    )
    .eq("id", userId)
    .maybeSingle();

  return { data: data ?? null, error };
};
