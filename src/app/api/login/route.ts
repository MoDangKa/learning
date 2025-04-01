import type { RawLoginResponseData } from "@/interfaces/api/user";
import { api, handleApiError } from "@/lib/apiService";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const envSchema = z.object({
  API_URL: z.string().min(1),
  JWT_TOKEN: z.string().min(1),
});

const dataSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .transform((val) => val.toLowerCase().trim()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password cannot exceed 50 characters"),
});

const env = envSchema.parse(process.env);

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const data = dataSchema.parse(json);

    const response = await api.post<RawLoginResponseData>(
      `${env.API_URL}/login`,
      data
    );

    const result = NextResponse.json(response.data, {
      status: response.status,
      statusText: response.statusText,
    });

    if (response.data?.token) {
      result.cookies.set(env.JWT_TOKEN, response.data.token, {
        sameSite: "strict",
        httpOnly: true,
        secure: process.env.MODE === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1w
      });
    }

    return result;
  } catch (error) {
    return handleApiError(error);
  }
}
