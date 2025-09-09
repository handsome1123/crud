// app/api/buyer/products/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";

export async function GET() {
  try {
    // 1️⃣ Connect to MongoDB
    await connectDB();

    // 2️⃣ Fetch all products
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .populate("sellerId", "name email"); // optional: get seller info

    // 3️⃣ Return products
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/buyer/products error:", error);
    return NextResponse.json({ error: (error as Error).message || "Server error" }, { status: 500 });
  }
}

