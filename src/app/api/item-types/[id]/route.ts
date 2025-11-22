import { NextResponse } from "next/server";
import ItemType from "@/models/ItemType";
import {connectDB} from "@/lib/db";

// GET specific type
export async function GET(req: Request, { params }: any) {
  await connectDB();
  const type = await ItemType.findById(params.id);
  return NextResponse.json(type);
}

// UPDATE item type
export async function PUT(req: Request, { params }: any) {
  try {
    await connectDB();
    const body = await req.json();

    const updated = await ItemType.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

// DELETE item type
export async function DELETE(req: Request, { params }: any) {
  try {
    await connectDB();

    await ItemType.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Deleted" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
