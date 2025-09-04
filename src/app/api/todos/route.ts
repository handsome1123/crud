import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Todo from "@/models/Todo";

// CREATE
export async function POST(req: Request) {
  await connectDB();
  const { title } = await req.json();
  const newTodo = await Todo.create({ title });
  return NextResponse.json(newTodo);
}

// READ
export async function GET() {
  await connectDB();
  const todos = await Todo.find();
  return NextResponse.json(todos);
}
