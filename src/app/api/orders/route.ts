import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Define interfaces for better type safety
interface JWTPayload {
  id?: string;
  userId?: string;
  iat?: number;
  exp?: number;
}

interface OrderItem {
  product: string;
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
  items: OrderItem[];
  total: number;
}

// Helper function to verify token
function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Check both cookie and Authorization header
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('token');
    const authHeader = request.headers.get('Authorization');
    const headerToken = authHeader?.replace('Bearer ', '');

    const token = cookieToken?.value || headerToken;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Fetch orders with populated product data
    const orders = await Order.find({ userId: decoded.id || decoded.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    console.log("Found orders:", orders.length);
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: "Failed to fetch orders: " + errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Check both cookie and Authorization header for consistency
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('token');
    const authHeader = req.headers.get("Authorization");
    const headerToken = authHeader?.replace('Bearer ', '');

    const token = cookieToken?.value || headerToken;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Parse request body
    const body: CreateOrderBody = await req.json();
    const { customer, items, total } = body;
    
    if (!customer || !items || !total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create order using Mongoose model (more consistent with your GET method)
    const order = await Order.create({
      userId: decoded.id || decoded.userId, // Handle both possible field names
      customer,
      items,
      total,
      status: "pending",
      createdAt: new Date(),
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