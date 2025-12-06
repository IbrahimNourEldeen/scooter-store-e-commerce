import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Coupon from "@/models/Coupon";

// GET one
export async function GET(req: Request, { params }: any) {
  await connectDB();
  const coupon = await Coupon.findById(params.id);
  return NextResponse.json(coupon);
}

// UPDATE
export async function PUT(req: Request, { params }: any) {
  try {
    await connectDB();
    const body = await req.json();

    const updated = await Coupon.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    return NextResponse.json(updated);

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

// DELETE
export async function DELETE(req: Request, { params }: any) {
  try {
    await connectDB();
    await Coupon.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Coupon deleted" });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
