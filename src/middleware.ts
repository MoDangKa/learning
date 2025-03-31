import { chain, withAuthentication, withNonce } from "./middlewares";

export default chain([withNonce, withAuthentication]);

export const config = {
  matcher: "/:path*",
};
