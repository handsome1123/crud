import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) 
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const description = formData.get("description") as string;
    const imageFile = formData.get("image");

    if (!name || !price) return NextResponse.json({ error: "Name and price required" }, { status: 400 });

    let imageUrl = "";

    if (imageFile instanceof File && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const mimeType = imageFile.type;
      const dataUri = `data:${mimeType};base64,${base64}`;

      const result = await cloudinary.uploader.upload(dataUri, { folder: "products" });
      imageUrl = result.secure_url;
    }

    const product = await Product.create({ name, price, description, imageUrl, user: user.id });
    return NextResponse.json(product);
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({});
    return NextResponse.json(products); // always return JSON array
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json([], { status: 500 }); // fallback: empty array
  }
}