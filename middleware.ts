



import { NextRequest, NextResponse } from "next/server";
const publicPaths = ["/api/auth/nonce", "/api/auth/verifyArbitrary", "/api/users"];
export async function middleware(req: NextRequest) {
  console.log("------>REQ:",req)
  if (publicPaths.includes(req.nextUrl.pathname)) {
    NextResponse.next();
    return;
  }
  const token = req.headers.get("authorization")?.split("Bearer ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try{
    const { jwtVerify } = await import("jose");
    const secretKey = new TextEncoder().encode(
      process.env.SUPABASE_JWT_SECRET || "your-secret-key"
    );
    const decoded = jwtVerify(token,secretKey);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
    }
  }catch(error){

  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*", // Protects all API routes under `/api/protected/`
};

/*
import { type NextRequest, NextResponse } from "next/server";

const publicPaths = ["/", "/mesaj", "/api/auth/nonce", "/api/auth/verifyArbitrary", "/api/users"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  console.log("middleware -> token:", token);

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



*/
