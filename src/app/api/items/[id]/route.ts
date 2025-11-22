import { NextResponse } from "next/server";
import Item from "@/models/Item";
import {connectDB} from "@/lib/db";

// GET one item
export async function GET(req: Request, { params }: any) {
  await connectDB();
  const item = await Item.findById(params.id)
    .populate("typeId")
    .populate("brandId");

  return NextResponse.json(item);
}

// UPDATE item
export async function PUT(req: Request, { params }: any) {
  try {
    await connectDB();
    const body = await req.json();

    const updated = await Item.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

// DELETE item
export async function DELETE(req: Request, { params }: any) {
  try {
    await connectDB();

    await Item.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Item deleted" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
