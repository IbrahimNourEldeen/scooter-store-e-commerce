import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import StockTransaction from "@/models/StockTransaction";

// GET stock transactions
export async function GET(req: Request) {
  await connectDB();

  const url = new URL(req.url);
  const itemId = url.searchParams.get("itemId");
  const movementType = url.searchParams.get("movementType");

  let filter: any = {};

  if (itemId) filter.itemId = itemId;
  if (movementType) filter.movementType = movementType;

  const transactions = await StockTransaction.find(filter)
    .populate("itemId")
    .populate("userId", "name")
    .sort({ createdAt: -1 });

  return NextResponse.json(transactions);
}


// CREATE stock transaction
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const transaction = await StockTransaction.create(body);

    return NextResponse.json(transaction, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
