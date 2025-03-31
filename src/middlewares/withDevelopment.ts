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

const DEVELOPMENT_API_ROUTES: ApiRoute[] = [{ path: "/api/fake-data" }];

export function withDevelopment(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const { pathname } = request.nextUrl;

    if (env.MODE !== "development") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "DEV_MODE_REQUIRED",
            message: "This endpoint is only available in development mode",
          },
        },
        { status: 403 }
      );
    }

    const requiresAuth = DEVELOPMENT_API_ROUTES.some((route) => {
      const pathMatches =
        typeof route.path === "string"
          ? pathname.startsWith(route.path)
          : route.path.test(pathname);

      const methodMatches = route.methods
        ? route.methods.includes(request.method)
        : true;

      return pathMatches && methodMatches;
    });

    if (requiresAuth) {
      const token = request.cookies.get(env.JWT_TOKEN)?.value;

      if (!token) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "UNAUTHENTICATED",
              message: "Authentication required",
            },
          },
          { status: 401 }
        );
      }
    }

    return middleware(request, event);
  };
}
