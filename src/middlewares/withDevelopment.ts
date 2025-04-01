import { checkApiRoutes } from "@/lib/utils";
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";
import { z } from "zod";

const envSchema = z.object({
  MODE: z.enum(["development", "production", "test"]),
});

const env = envSchema.parse(process.env);

const DEVELOPMENT_API_ROUTES: ApiRoute[] = [{ path: "/api/fake-data" }];

export function withDevelopment(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const require = checkApiRoutes(request, DEVELOPMENT_API_ROUTES);
    if (require && env.MODE !== "development") {
      return NextResponse.json(
        { error: "This endpoint is for development only" },
        {
          status: 403,
          statusText: "Dev mode required",
        }
      );
    }
    return middleware(request, event);
  };
}
