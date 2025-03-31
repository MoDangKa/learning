import { UsersResponseData } from "@/interfaces/api/external/user";
import { MappedUser } from "@/interfaces/api/internal/user";
import apiService from "@/lib/apiService";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const envSchema = z.object({
  API_URL: z.string().min(1),
  JWT_TOKEN: z.string().min(1),
});

const env = envSchema.parse(process.env);

export async function GET(request: NextRequest) {
  const token = request.cookies.get(env.JWT_TOKEN)?.value;

  const { status, statusText, data, success } =
    await apiService<UsersResponseData>({
      method: "GET",
      maxBodyLength: Infinity,
      url: `${env.API_URL}/users`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

  if (success) {
    const mappedUserList: MappedUser[] = data.users.map((user) => ({
      ...user,
      passwordResetToken: user.password_reset_token,
      passwordResetExpires: user.password_reset_expires,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }));
    return NextResponse.json(
      { users: mappedUserList },
      {
        status,
        statusText,
      }
    );
  }

  return NextResponse.json(data, {
    status,
    statusText,
  });
}
