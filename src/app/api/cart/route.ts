import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";

// GET cart for specific user
export async function GET(req: Request) {
  await connectDB();

  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { message: "userId is required" },
      { status: 400 }
    );
  }

  let cart = await Cart.findOne({ userId }).populate("items.itemId");

  // return empty cart if not found
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  return NextResponse.json(cart);
}

// ADD item to cart
export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId, itemId, quantity = 1 } = await req.json();

    if (!userId || !itemId) {
      return NextResponse.json(
        { message: "userId and itemId are required" },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({ userId });

    // If no cart → create new
    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ itemId, quantity }],
      });

      return NextResponse.json(cart, { status: 201 });
    }

    // If item exists → increase quantity
    const existingItem = cart.items.find(
      (i: any) => i.itemId.toString() === itemId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ itemId, quantity });
    }

    await cart.save();
    return NextResponse.json(cart);

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
