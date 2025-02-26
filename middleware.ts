import { type NextRequest, NextResponse } from "next/server";

const publicPaths = ["/", "/chat", "/api/auth/nonce", "/api/auth/verifyArbitrary", "/api/users"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  console.log("middleware -> token:", token);

  console.log(request.nextUrl.pathname);

  if (publicPaths.includes(request.nextUrl.pathname)) {
    NextResponse.next();
    return;
  }

  if (token) {
    try {
      const { jwtVerify } = await import("jose");

      const secretKey = new TextEncoder().encode(
        process.env.SUPABASE_JWT_SECRET || "your-secret-key"
      );

      const { payload } = await jwtVerify(token, secretKey);

      console.log("Token verified successfully:", payload);
      return NextResponse.next();
    } catch (error) {
      console.error("Token verification failed:", error);

      if (!publicPaths.includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/", request.nextUrl));
      }
    }
  }

  // return 401
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
