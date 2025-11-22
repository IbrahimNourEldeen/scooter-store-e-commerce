import { NextResponse } from "next/server";
import ItemType from "@/models/ItemType";
import {connectDB} from "@/lib/db";

// GET all item types
export async function GET() {
  await connectDB();
  const types = await ItemType.find().sort({ createdAt: -1 });
  return NextResponse.json(types);
}

// CREATE item type
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newType = await ItemType.create(body);
    return NextResponse.json(newType, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
