import { NextResponse } from "next/server";
import User from "@/models/User";
import {connectDB} from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Token handling will be added later
    return NextResponse.json({
      message: "Login successful",
      user,
    });

  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 400 }
    );
  }
}
