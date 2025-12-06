import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Wishlist from "@/models/Wishlist";

// DELETE item from wishlist
export async function DELETE(req: Request, { params }: any) {
  try {
    await connectDB();

    const itemId = params.id;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "userId is required" }, { status: 400 });
    }

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return NextResponse.json({ message: "Wishlist not found" }, { status: 404 });
    }

    wishlist.items = wishlist.items.filter(
      (id: any) => id.toString() !== itemId
    );

    await wishlist.save();

    return NextResponse.json(wishlist);

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
