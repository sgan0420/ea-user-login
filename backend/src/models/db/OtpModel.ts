import { OtpType } from "../common/OtpTypeModel";

export interface OtpRecord {
  id: string;
  user_id: string;
  code: string;
  type: OtpType;
  expires_at: string;
  used: boolean;
  created_at: string;
}

export interface NewOtp {
  user_id: string;
  code: string;
  type: OtpType;
  expires_at: string;
  used?: boolean;
}
