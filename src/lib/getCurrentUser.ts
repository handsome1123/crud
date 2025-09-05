import { cookies } from "next/headers";
import * as jose from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);

export interface CurrentUser {
  id: string;
  role: "buyer" | "seller" | "admin";
  email?: string;
  name?: string;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies(); // ✅ await here
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return {
      id: payload.id as string,
      role: payload.role as CurrentUser["role"],
      email: payload.email as string | undefined,
      name: payload.name as string | undefined,
    };
  } catch (error) {
    console.error("getCurrentUser: JWT invalid", error);
    return null;
  }
}
