import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PaymentMethod from "@/models/PaymentMethod";

// GET one payment method
export async function GET(req: Request, { params }: any) {
  await connectDB();
  const method = await PaymentMethod.findById(params.id);
  return NextResponse.json(method);
}

// UPDATE payment method
export async function PUT(req: Request, { params }: any) {
  try {
    await connectDB();
    const body = await req.json();

    const updated = await PaymentMethod.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    return NextResponse.json(updated);

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

// DELETE payment method
export async function DELETE(req: Request, { params }: any) {
  try {
    await connectDB();
    await PaymentMethod.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Payment method deleted" });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
