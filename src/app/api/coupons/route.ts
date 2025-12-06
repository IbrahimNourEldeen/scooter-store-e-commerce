import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Coupon from "@/models/Coupon";

// GET All
export async function GET() {
  await connectDB();
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  return NextResponse.json(coupons);
}

// CREATE
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const coupon = await Coupon.create(body);
    return NextResponse.json(coupon, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
