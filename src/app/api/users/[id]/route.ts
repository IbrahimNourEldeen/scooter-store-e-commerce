import { NextResponse } from "next/server";
import User from "@/models/User";
import {connectDB} from "@/lib/db";
import bcrypt from "bcryptjs";

// GET specific user
export async function GET(req: Request, { params }: any) {
  await connectDB();
  const user = await User.findById(params.id);
  return NextResponse.json(user);
}

// UPDATE user
export async function PUT(req: Request, { params }: any) {
  try {
    await connectDB();

    const body = await req.json();

    // If updating password, hash it
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    const updated = await User.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    return NextResponse.json(updated);

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

// DELETE user
export async function DELETE(req: Request, { params }: any) {
  try {
    await connectDB();
    await User.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "User deleted" });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
