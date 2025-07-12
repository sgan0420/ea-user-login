export interface UserRecord {
  id: string;
  username: string;
  email: string;
  password: string;
  is_verified: boolean;
  created_at: string;
}

export interface NewUser {
  username: string;
  email: string;
  password: string;
  is_verified?: boolean;
}
