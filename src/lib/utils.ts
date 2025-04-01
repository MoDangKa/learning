import { NextRequest } from "next/server";

export const checkApiRoutes = (request: NextRequest, apiRoutes: ApiRoute[]) => {
  const pathname = request.nextUrl.pathname;

  return apiRoutes.some((route) => {
    const pathMatches =
      typeof route.path === "string"
        ? pathname.startsWith(route.path)
        : route.path.test(pathname);

    const methodMatches = route.methods
      ? route.methods.includes(request.method)
      : true;

    return pathMatches && methodMatches;
  });
};
