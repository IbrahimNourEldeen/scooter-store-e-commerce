import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PaymentMethod from "@/models/PaymentMethod";

// GET all payment methods
export async function GET() {
  await connectDB();
  const methods = await PaymentMethod.find().sort({ createdAt: -1 });
  return NextResponse.json(methods);
}

// CREATE payment method
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const method = await PaymentMethod.create(body);
    return NextResponse.json(method, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
