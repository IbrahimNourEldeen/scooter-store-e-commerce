import { NextResponse } from "next/server";
import Brand from "@/models/Brand";
import {connectDB} from "@/lib/db";

// GET all brands
export async function GET() {
  await connectDB();
  const brands = await Brand.find().sort({ createdAt: -1 });
  return NextResponse.json(brands);
}

// CREATE brand
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const brand = await Brand.create(body);
    return NextResponse.json(brand, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
