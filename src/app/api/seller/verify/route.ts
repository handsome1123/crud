import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { verifyToken } from "@/lib/jwt";

interface DecodedToken {
  id: string;
  role: "buyer" | "seller" | "admin";
}

interface VerifyBody {
  documentUrl: string;
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token) as DecodedToken | null;
    if (!payload || payload.role !== "seller") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body: VerifyBody = await req.json();
    const { documentUrl } = body;
    if (!documentUrl) {
      return NextResponse.json({ error: "Document URL is required" }, { status: 400 });
    }

    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.documentUrl = documentUrl;
    user.isVerified = true;
    await user.save();

    return NextResponse.json({ message: "Verification submitted", user });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
