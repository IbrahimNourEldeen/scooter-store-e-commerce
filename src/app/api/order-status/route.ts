import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import OrderStatus from "@/models/OrderStatus";

// GET all order statuses
export async function GET() {
  await connectDB();

  const statuses = await OrderStatus.find().sort({ createdAt: -1 });
  return NextResponse.json(statuses);
}

// CREATE new status
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const status = await OrderStatus.create(body);
    return NextResponse.json(status, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
