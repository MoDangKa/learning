import { LoginAPI } from "@/interfaces/api/login";
import apiService from "@/lib/apiService";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const envSchema = z.object({
  API_URL: z.string().min(1),
  JWT_TOKEN: z.string().min(1),
});

const env = envSchema.parse(process.env);

export async function POST(request: NextRequest) {
  const json = await request.json();

  const { email, password } = json;
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  const { status, statusText, data } = await apiService<LoginAPI>({
    method: "POST",
    url: `${env.API_URL}/login`,
    data: json,
  });

  const response = NextResponse.json(data, {
    status,
    statusText,
  });

  if (data?.token) {
    response.cookies.set(env.JWT_TOKEN, data.token, {
      sameSite: "strict",
      httpOnly: true,
      secure: process.env.MODE === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1w
    });
  }

  return response;
}
