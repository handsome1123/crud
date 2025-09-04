import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Todo from "@/models/Todo";
import { verifyToken } from "@/lib/auth";

// CREATE
export async function POST(req: Request) {
  await connectDB();

  const authHeader = req.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { title } = await req.json();
  const newTodo = await Todo.create({ title, user: decoded.id });

  return NextResponse.json(newTodo);
}

// READ (only user's todos)
export async function GET(req: Request) {
  await connectDB();

  const authHeader = req.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const todos = await Todo.find({ user: decoded.id });
  return NextResponse.json(todos);
}
