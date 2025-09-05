import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { cookies } from "next/headers";

// Define interfaces for better type safety
interface JWTPayload {
  id?: string;
  userId?: string;
  iat?: number;
  exp?: number;
}

interface CartItem {
  _id?: string;
  id?: string;
  quantity: number;
  price: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  address?: string;
  phone?: string;
}

interface CreateOrderBody {
  customer: CustomerInfo;
  items: CartItem[];
  total: number;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    // ✅ Await params before using
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    // Optional: Add authentication check
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('token');
    const authHeader = req.headers.get("Authorization");
    const headerToken = authHeader?.replace('Bearer ', '');
    const token = cookieToken?.value || headerToken;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token) as JWTPayload | null;
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Find order and ensure it belongs to the user
    const order = await Order.findOne({ 
      _id: id, 
      userId: decoded.id || decoded.userId 
    }).populate("items.product");

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("GET order error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ 
      error: "Failed to fetch order: " + errorMessage 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Get token
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('token');
    const authHeader = req.headers.get("Authorization");
    const headerToken = authHeader?.replace('Bearer ', '');
    const token = cookieToken?.value || headerToken;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token) as JWTPayload | null;
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body: CreateOrderBody = await req.json();
    const { customer, items, total } = body;
    
    if (!customer || !items || !total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Transform cart items to match your schema
    const transformedItems = items.map((item: CartItem) => ({
      product: item._id || item.id,
      quantity: item.quantity,
      price: item.price
    }));

    // Create order
    const order = await Order.create({
      userId: decoded.id || decoded.userId,
      customer,
      items: transformedItems,
      total,
      status: "pending",
    });

    return NextResponse.json({ _id: order._id }, { status: 201 });
  } catch (error) {
    console.error("POST orders error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: "Failed to create order: " + errorMessage },
      { status: 500 }
    );
  }
}