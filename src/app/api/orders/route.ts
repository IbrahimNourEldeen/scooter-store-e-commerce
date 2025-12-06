import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Stock from "@/models/Stock";
import InvoiceHeader from "@/models/InvoiceHeader";
import InvoiceDetail from "@/models/InvoiceDetail";

export async function POST(req: Request) {
  await connectDB();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, paymentMethodId, addressId, discount = 0 } = await req.json();

    // 1️⃣ جلب Cart
    const cart = await Cart.findOne({ userId }).session(session);
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    let total = 0;

    // 2️⃣ تحقق من stock لكل عنصر
    for (const cartItem of cart.items) {
      const stock = await Stock.findOne({ itemId: cartItem.itemId }).session(session);
      if (!stock) throw new Error("Stock record not found for item");
      if (stock.quantity < cartItem.quantity) throw new Error(`Not enough stock for item`);

      total += cartItem.quantity * stock.itemId.price; // assuming price in Item model
    }

    const finalTotal = total - discount;

    // 3️⃣ إنشاء InvoiceHeader
    const invoiceHeader = await InvoiceHeader.create(
      [{ userId, paymentMethodId, addressId, total, discount, finalTotal }],
      { session }
    );
    const invoiceId = invoiceHeader[0]._id;

    // 4️⃣ إنشاء InvoiceDetails + تحديث stock + stock transaction
    for (const cartItem of cart.items) {
      const stock = await Stock.findOne({ itemId: cartItem.itemId }).session(session);

      await InvoiceDetail.create(
        [
          {
            invoiceId,
            itemId: cartItem.itemId,
            quantity: cartItem.quantity,
            price: stock.itemId.price,
            total: stock.itemId.price * cartItem.quantity,
          },
        ],
        { session }
      );

      stock.quantity -= cartItem.quantity;
      await stock.save({ session });
    }

    // 5️⃣ مسح cart
    cart.items = [];
    await cart.save({ session });

    // 6️⃣ commit transaction
    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({ message: "Order completed", invoiceId }, { status: 201 });

  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
