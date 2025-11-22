import { NextResponse } from "next/server";
import Item from "@/models/Item";
import {connectDB} from "@/lib/db";

// GET all items
export async function GET(req: Request) {
  await connectDB();

  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  const brand = url.searchParams.get("brand");
  const search = url.searchParams.get("search");

  // building dynamic filter
  let filter: any = {};
  if (type) filter.typeId = type;
  if (brand) filter.brandId = brand;
  if (search) filter.name = { $regex: search, $options: "i" };

  const items = await Item.find(filter)
    .populate("typeId")
    .populate("brandId")
    .sort({ createdAt: -1 });

  return NextResponse.json(items);
}

// CREATE item
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const item = await Item.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
