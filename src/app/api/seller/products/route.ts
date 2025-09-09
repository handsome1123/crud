import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { verifyToken } from "@/lib/jwt";
import cloudinary from "@/lib/cloudinary";

interface DecodedToken {
  id: string;
  role: string;
}

interface CloudinaryUploadResult {
  secure_url: string;
  [key: string]: unknown; // allow extra fields
}

export async function GET(req: Request) {
  try {
    // 1️⃣ Connect to MongoDB
    await connectDB();

    // 2️⃣ Get Authorization header
    const authHeader = req.headers.get("Authorization");

    let userId: string | null = null;
    let userRole: string | null = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = verifyToken(token) as DecodedToken | null;

      if (decoded) {
        userId = decoded.id;
        userRole = decoded.role;
      }
    }

    // 3️⃣ Build filter
    const filter: { sellerId?: string } = {};
    if (userRole === "seller" && userId) {
      // Sellers see only their products
      filter.sellerId = userId;
    }
    // Buyers or non-logged-in users see all products → filter stays empty

    // 4️⃣ Fetch products with optional user details
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .populate("sellerId", "name email"); // optional: get seller name/email

    // 5️⃣ Return products
    return NextResponse.json({ success: true, products }, { status: 200 });

  } catch (error: unknown) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: (error as Error).message || "Server error" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    await connectDB();

    // 🔑 Check Authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token) as DecodedToken | null;
    if (!decoded) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    if (decoded.role !== "seller") {
      return NextResponse.json({ error: "Only sellers can create products" }, { status: 403 });
    }

    // 📦 Parse FormData (not JSON!)
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock") || 0);
    const imageFile = formData.get("image") as File | null;

    if (!name || !price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    // ☁️ Upload image to Cloudinary
    let imageUrl = "";
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const uploadRes = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result as CloudinaryUploadResult);
          }
        );
        stream.end(buffer);
      });
      imageUrl = uploadRes.secure_url;
    }

    // 🛒 Save product
    const newProduct = new Product({
      name,
      description,
      price,
      imageUrl,
      stock,
      sellerId: decoded.id,
    });

    await newProduct.save();

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: (error as Error).message || "Server error"}, { status: 500 });
  }
}