import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";
import { z } from "zod";

const envSchema = z.object({
  MODE: z.enum(["development", "production", "test"]),
  JWT_TOKEN: z.string().min(1),
});

const env = envSchema.parse(process.env);

export function withDevelopment(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    if (env.MODE !== "development") {
      return NextResponse.json(
        {},
        {
          status: 403,
          statusText: "Dev mode required",
        }
      );
    }

    return middleware(request, event);
  };
}
