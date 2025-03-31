export interface MappedUser {
  id: number;
  email: string;
  password: string;
  name: string;
  photo: string;
  role: string;
  active: boolean;
  passwordResetToken: string;
  passwordResetExpires: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponseData {
  users: MappedUser[];
}
