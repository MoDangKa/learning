import { api, handleApiError } from "@/lib/apiService";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const envSchema = z.object({
  API_URL: z.string().url().min(1),
});

const dataSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email cannot exceed 100 characters")
    .transform((val) => val.toLowerCase().trim()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password cannot exceed 50 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
});

const env = envSchema.parse(process.env);

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const data = dataSchema.parse(json);

    const response = await api.post(`${env.API_URL}/register`, data);

    return NextResponse.json(response.data, {
      status: response.status,
      statusText: response.statusText,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
