import supabase from "../config/supabaseClient";
import { NewOtp, OtpRecord } from "../models/db/OtpModel";
import { OtpType } from "../models/common/OtpTypeModel";

export const createOtp = async (
  otp: NewOtp
): Promise<{ data: OtpRecord | null; error: any }> => {
  const { data, error } = await supabase
    .from("otps")
    .insert([otp])
    .select()
    .maybeSingle();

  return { data: data ?? null, error };
};

export const findValidOtp = async (
  userId: string,
  code: string,
  type: OtpType
): Promise<{ data: OtpRecord | null; error: any }> => {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("otps")
    .select("*")
    .eq("user_id", userId)
    .eq("code", code)
    .eq("type", type)
    .eq("used", false)
    .gt("expires_at", now)
    .maybeSingle();

  return { data: data ?? null, error };
};

export const markOtpAsUsed = async (
  otpId: string
): Promise<{ success: boolean; error: any }> => {
  const { error } = await supabase
    .from("otps")
    .update({ used: true })
    .eq("id", otpId);

  return { success: !error, error };
};
