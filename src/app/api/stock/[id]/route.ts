import { NextResponse } from "next/server";
import Stock from "@/models/Stock";
import {connectDB} from "@/lib/db";

// GET one stock record
export async function GET(req: Request, { params }: any) {
  await connectDB();
  const stock = await Stock.findById(params.id).populate("itemId");
  return NextResponse.json(stock);
}

// UPDATE stock record
export async function PUT(req: Request, { params }: any) {
  try {
    await connectDB();
    const body = await req.json();

    const updated = await Stock.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 400 }
    );
  }
}

// DELETE stock record
export async function DELETE(req: Request, { params }: any) {
  try {
    await connectDB();
    await Stock.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Stock entry deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 400 }
    );
  }
}
