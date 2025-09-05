import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect routes that require authentication
        if (
          req.nextUrl.pathname.startsWith("/dashboard") ||
          req.nextUrl.pathname.startsWith("/transacoes") ||
          req.nextUrl.pathname.startsWith("/categorias") ||
          req.nextUrl.pathname.startsWith("/contas-recorrentes") ||
          req.nextUrl.pathname.startsWith("/configuracoes")
        ) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/transacoes/:path*",
    "/categorias/:path*",
    "/contas-recorrentes/:path*",
    "/configuracoes/:path*",
  ],
};
