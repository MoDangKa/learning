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
    const pathname = request.nextUrl.pathname;

    const requiresAuth = AUTHENTICATED_API_ROUTES.some((route) => {
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
          {},
          {
            status: 401,
            statusText: "Unauthorized",
          }
        );
      }
    }

    return middleware(request, event);
  };
}
