import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Todo from "@/models/Todo";
import { verifyToken } from "@/lib/auth";

async function authenticate(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  return verifyToken(token);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const decoded = await authenticate(req);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Await the params to get the actual values
  const resolvedParams = await params;
  const body = await req.json();
  
  const updated = await Todo.findOneAndUpdate(
    { _id: resolvedParams.id, user: decoded.id },
    body,
    { new: true }
  );

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const decoded = await authenticate(req);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Await the params to get the actual values
  const resolvedParams = await params;
  
  const deleted = await Todo.findOneAndDelete({ 
    _id: resolvedParams.id, 
    user: decoded.id 
  });

  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ message: "Deleted" });
}