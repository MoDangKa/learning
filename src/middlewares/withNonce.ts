import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";

export function withNonce(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

    const contentSecurityPolicyHeaderValue = cspHeader
      .replace(/\s{2,}/g, " ")
      .trim();

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);

    requestHeaders.set(
      "Content-Security-Policy",
      contentSecurityPolicyHeaderValue
    );

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    response.headers.set(
      "Content-Security-Policy",
      contentSecurityPolicyHeaderValue
    );

    return middleware(request, event);
  };
}
