import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Wishlist from "@/models/Wishlist";

// GET wishlist by userId ?userId=
export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "userId is required" }, { status: 400 });
  }

  const wishlist = await Wishlist.findOne({ userId }).populate("items");

  return NextResponse.json(wishlist || { userId, items: [] });
}

// ADD item to wishlist
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId, itemId } = body;

    let wishlist = await Wishlist.findOne({ userId });

    // create if not exists
    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId,
        items: [itemId],
      });
    } else {
      // avoid duplicates
      if (!wishlist.items.includes(itemId)) {
        wishlist.items.push(itemId);
        await wishlist.save();
      }
    }

    return NextResponse.json(wishlist, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

// CLEAR wishlist
export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "userId is required" }, { status: 400 });
    }

    await Wishlist.findOneAndUpdate(
      { userId },
      { items: [] }
    );

    return NextResponse.json({ message: "Wishlist cleared" });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
