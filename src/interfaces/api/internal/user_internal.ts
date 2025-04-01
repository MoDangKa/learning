import { RawUser } from "../external/user_external";

export interface MappedUser
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
  users: MappedUser[];
}
