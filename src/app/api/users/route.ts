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

  const { status, statusText, data } = await apiService({
    method: "GET",
    maxBodyLength: Infinity,
    url: `${env.API_URL}/users`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return NextResponse.json(data, {
    status,
    statusText,
  });
}
