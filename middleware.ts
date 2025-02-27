



import { NextRequest, NextResponse } from "next/server";
const publicPaths = ["/api/auth/nonce", "/api/auth/verifyArbitrary", "/api/users"];
export async function middleware(req: NextRequest) {

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
  matcher: "/api/:path*", 
};


