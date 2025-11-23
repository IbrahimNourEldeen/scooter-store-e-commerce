import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import StockTransaction from "@/models/StockTransaction";


// GET single transaction
export async function GET(req: Request, { params }: any) {
  await connectDB();

  const transaction = await StockTransaction.findById(params.id)
    .populate("itemId")
    .populate("userId", "name");

  return NextResponse.json(transaction);
}


// UPDATE transaction
export async function PUT(req: Request, { params }: any) {
  try {
    await connectDB();
    const body = await req.json();

    const updated = await StockTransaction.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    return NextResponse.json(updated);

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}


// DELETE transaction
export async function DELETE(req: Request, { params }: any) {
  try {
    await connectDB();

    await StockTransaction.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Transaction deleted" });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
