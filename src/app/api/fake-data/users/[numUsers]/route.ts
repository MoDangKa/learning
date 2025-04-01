import { handleApiError } from "@/lib/apiService";
import { faker } from "@faker-js/faker";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const envSchema = z.object({
  MODE: z.enum(["development", "production", "test"]),
  API_URL: z.string().min(1),
  JWT_TOKEN: z.string().min(1),
});

const env = envSchema.parse(process.env);

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

  if (typeof numUsers !== "number" || numUsers <= 0) {
    return NextResponse.json(
      { error: "Invalid numUsers parameter" },
      { status: 400 }
    );
  }

  const token = request.cookies.get(env.JWT_TOKEN)?.value;

  try {
    const registerList = [];
    for (let i = 0; i < numUsers; i++) {
      const data = {
        email: faker.internet.email(),
        password: "thankyou123",
        name: faker.person.fullName(),
        photo: faker.image.avatar(),
      };

      registerList.push(() =>
        axios.post(`${env.API_URL}/register`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      );
    }

    const throttleLimit = 10;
    const pLimit = (await import("p-limit")).default;
    const limit = pLimit(throttleLimit);

    const results = await Promise.all(registerList.map((fn) => limit(fn)));

    const successes = results.filter((res) => res.status === 201).length;
    return NextResponse.json(
      { success: true, registered: successes },
      { status: 201, statusText: "Fake data is successful" }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
