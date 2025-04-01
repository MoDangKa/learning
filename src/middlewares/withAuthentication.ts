import { checkApiRoutes } from "@/lib/utils";
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";
import { z } from "zod";

const envSchema = z.object({
  JWT_TOKEN: z.string().min(1),
});

const env = envSchema.parse(process.env);

const AUTHENTICATED_API_ROUTES: ApiRoute[] = [
  { path: "/api/fake-data" },
  { path: "/api/users" },
];

export function withAuthentication(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const token = request.cookies.get(env.JWT_TOKEN)?.value;
    const require = checkApiRoutes(request, AUTHENTICATED_API_ROUTES);
    if (require && !token) {
      return NextResponse.json(
        { error: "Authentication required" },
        {
          status: 401,
          statusText: "Unauthorized",
        }
      );
    }
    return middleware(request, event);
  };
}
