import { handleApiError } from "@/lib/apiService";
import { getClient } from "@/lib/database";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const envSchema = z.object({
  MODE: z.enum(["development", "production", "test"]),
});

const env = envSchema.parse(process.env);
const SALT_ROUNDS = 10;

export async function POST(
  request: NextRequest,
  { params }: { params: { numUsers: string } }
) {
  if (env.MODE !== "development") {
    return NextResponse.json(
      { error: "This endpoint is for development only" },
      { status: 401 }
    );
  }

  const { numUsers: paramNumUsers } = await params;
  const numUsers = parseInt(paramNumUsers);

  if (!Number.isInteger(numUsers) || numUsers <= 0) {
    return NextResponse.json(
      { error: "numUsers must be a positive integer" },
      { status: 400 }
    );
  }

  try {
    const client = await getClient();

    for (let i = 0; i < numUsers; i++) {
      const email = faker.internet.email();
      const name = faker.person.fullName();
      const photo = faker.image.avatar();
      const hash = await bcrypt.hash("strings123", SALT_ROUNDS);

      await client.query(
        "INSERT INTO public.users (email, password, name, photo) VALUES ($1, $2, $3, $4)",
        [email, hash, name, photo]
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 201, statusText: "Fake data creation successful" }
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
