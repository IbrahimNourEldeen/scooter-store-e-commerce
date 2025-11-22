import { NextResponse } from "next/server";
import User from "@/models/User";
import {connectDB} from "@/lib/db";
import bcrypt from "bcryptjs";

// GET all users (admin only - frontend will handle auth later)
export async function GET() {
  await connectDB();
  const users = await User.find().sort({ createdAt: -1 });
  return NextResponse.json(users);
}

// REGISTER user
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { fullName, email, password } = body;

    // check existing email
    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);
    body.password = hashed;

    const newUser = await User.create(body);
    return NextResponse.json(newUser, { status: 201 });

  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 400 }
    );
  }
}
