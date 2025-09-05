import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" }, 
        { status: 400 }
      );
    } 

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" }, 
        { status: 400 }
      );
    }     

    // hash password
    const hashedPassword = await hashPassword(password);

    // create user (role = buyer by default)
    const newUser = await User.create({ 
      name, 
      email, 
      password: hashedPassword,
      phone,
      role: "buyer" // Default role assignment
    });

    return NextResponse.json(
      { message: "User created successfully", userId: newUser._id }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during user signup:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  } 
}