export interface RawLoginResponseData {
  token: string;
  user: RawUser;
}

export interface RawUser {
  id: number;
  email: string;
  password: string;
  name: string;
  photo: string;
  role: string;
  active: boolean;
  password_reset_token: string;
  password_reset_expires: string;
  created_at: string;
  updated_at: string;
}

export interface RawUsersResponseData {
  users: RawUser[];
}

export interface User
  extends Omit<
    RawUser,
    | "password_reset_token"
    | "password_reset_expires"
    | "created_at"
    | "updated_at"
  > {
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponseData {
  users: User[];
}
