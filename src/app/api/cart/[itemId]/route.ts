import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";

// UPDATE quantity of specific item
export async function PUT(req: Request, { params }: any) {
  try {
    await connectDB();
    const { userId, quantity } = await req.json();

    if (!userId || !quantity) {
      return NextResponse.json(
        { message: "userId and quantity are required" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId });
    if (!cart)
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });

    const item = cart.items.find(
      (i: any) => i.itemId.toString() === params.itemId
    );

    if (!item)
      return NextResponse.json({ message: "Item not found in cart" }, { status: 404 });

    item.quantity = quantity;

    await cart.save();
    return NextResponse.json(cart);

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

// REMOVE item from cart
export async function DELETE(req: Request, { params }: any) {
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

    cart.items = cart.items.filter(
      (i: any) => i.itemId.toString() !== params.itemId
    );

    await cart.save();

    return NextResponse.json({ message: "Item removed", cart });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
