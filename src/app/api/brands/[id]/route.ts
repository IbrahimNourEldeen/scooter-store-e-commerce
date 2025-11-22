import { NextResponse } from "next/server";
import Brand from "@/models/Brand";
import {connectDB} from "@/lib/db";

// GET one brand
export async function GET(req: Request, { params }: any) {
  await connectDB();
  const brand = await Brand.findById(params.id);
  return NextResponse.json(brand);
}

// UPDATE brand
export async function PUT(req: Request, { params }: any) {
  try {
    await connectDB();
    const body = await req.json();

    const updated = await Brand.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

// DELETE brand
export async function DELETE(req: Request, { params }: any) {
  try {
    await connectDB();

    await Brand.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Brand deleted" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
