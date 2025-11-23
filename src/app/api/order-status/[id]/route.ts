import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import OrderStatus from "@/models/OrderStatus";

// GET single status
export async function GET(req: Request, { params }: any) {
  await connectDB();

  const status = await OrderStatus.findById(params.id);
  return NextResponse.json(status);
}

// UPDATE status
export async function PUT(req: Request, { params }: any) {
  try {
    await connectDB();
    const body = await req.json();

    const updated = await OrderStatus.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    return NextResponse.json(updated);
    
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

// DELETE status
export async function DELETE(req: Request, { params }: any) {
  try {
    await connectDB();

    await OrderStatus.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Status deleted" });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
