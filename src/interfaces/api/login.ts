export interface LoginAPI {
  token: string;
  user: {
    id: number;
    email: string;
    password: string;
    name: string;
    photo: string;
    role: string;
    active: boolean;
    password_reset_toke: string;
    password_reset_expires: string;
    created_at: string;
    updated_at: string;
  };
}
