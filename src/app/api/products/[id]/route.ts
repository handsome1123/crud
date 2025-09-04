import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  
  // Await the params to get the actual values
  const resolvedParams = await params;
  
  const product = await Product.findById(resolvedParams.id);
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json(product);
}