import { UsersResponseData } from "@/interfaces/api/external/user_external";
import { MappedUser } from "@/interfaces/api/internal/user_internal";
import { api, handleApiError } from "@/lib/apiService";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const envSchema = z.object({
  API_URL: z.string().min(1),
  JWT_TOKEN: z.string().min(1),
});

const env = envSchema.parse(process.env);

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(env.JWT_TOKEN)?.value;

    const response = await api.get<UsersResponseData>(
      `${env.API_URL}/users`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      const mappedUserList: MappedUser[] = response.data.users.map((user) => ({
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        photo: user.photo,
        role: user.role,
        active: user.active,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      }));
      return NextResponse.json(
        { users: mappedUserList },
        {
          status: response.status,
          statusText: response.statusText,
        }
      );
    }

    return NextResponse.json(response.data, {
      status: response.status,
      statusText: response.statusText,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
