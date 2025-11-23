import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId });

    if (!cart)
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });

    cart.items = [];
    await cart.save();

    return NextResponse.json({ message: "Cart cleared" });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
