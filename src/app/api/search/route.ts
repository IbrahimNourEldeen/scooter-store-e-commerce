import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Item from "@/models/Item";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { query, brand_id, type_id, min_price, max_price } = await req.json();

    // Build filters dynamically
    const filters: any = {};

    // Keyword search
    if (query) {
      filters.name = { $regex: query, $options: "i" };
    }

    // Filter by brand
    if (brand_id && brand_id !== "all") {
      filters.brandId = brand_id;
    }

    // Filter by type
    if (type_id && type_id !== "all") {
      filters.typeId = type_id;
    }

    // Price range
    if (min_price || max_price) {
      filters.price = {};
      if (min_price) filters.price.$gte = Number(min_price);
      if (max_price) filters.price.$lte = Number(max_price);
    }

    const items = await Item.find(filters)
      .populate("brandId")
      .populate("typeId")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      total: items.length,
      items,
    });

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
