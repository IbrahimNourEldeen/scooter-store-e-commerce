import { NextResponse } from "next/server";
import Stock from "@/models/Stock";
import {connectDB} from "@/lib/db";

// GET all stock items
export async function GET() {
  await connectDB();

  const stock = await Stock.find()
    .populate("itemId")
    .sort({ createdAt: -1 });

  return NextResponse.json(stock);
}

// CREATE stock record
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Ensure no duplicate stock per item
    const exists = await Stock.findOne({ itemId: body.itemId });
    if (exists) {
      return NextResponse.json(
        { message: "Stock for this item already exists" },
        { status: 400 }
      );
    }

    const stock = await Stock.create(body);
    return NextResponse.json(stock, { status: 201 });

  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 400 }
    );
  }
}
