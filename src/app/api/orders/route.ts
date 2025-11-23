import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import InvoiceHeader from "@/models/InvoiceHeader";
import InvoiceDetail from "@/models/InvoiceDetail";
import Item from "@/models/Item";
import StockTransaction from "@/models/StockTransaction";
import Cart from "@/models/Cart";
import mongoose from "mongoose";

// GET all orders
export async function GET() {
  await connectDB();

  const orders = await InvoiceHeader.find()
    .populate("userId", "name email")
    .populate("paymentMethodId")
    .populate("addressId")
    .populate("statusId")
    .sort({ createdAt: -1 });

  return NextResponse.json(orders);
}

// CREATE order (Checkout)
export async function POST(req: Request) {
  await connectDB();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = await req.json();
    const { userId, paymentMethodId, addressId, discount = 0 } = body;

    // 1) Get Cart
    const cart = await Cart.findOne({ userId }).session(session);

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { message: "Cart is empty" },
        { status: 400 }
      );
    }

    let total = 0;

    // 2) حساب الإجمالي + التأكد من المخزون
    for (const cartItem of cart.items) {
      const item = await Item.findById(cartItem.itemId).session(session);

      if (!item) {
        throw new Error("Item not found");
      }

      if (item.stock < cartItem.quantity) {
        throw new Error(`Not enough stock for item: ${item.name}`);
      }

      total += item.price * cartItem.quantity;
    }

    const finalTotal = total - discount;

    // 3) إنشاء InvoiceHeader
    const invoiceHeader = await InvoiceHeader.create(
      [
        {
          userId,
          paymentMethodId,
          addressId,
          total,
          discount,
          finalTotal,
        },
      ],
      { session }
    );

    const invoiceId = invoiceHeader[0]._id;

    // 4) إنشاء كل التفاصيل + خصم المخزون + stock transaction
    for (const cartItem of cart.items) {
      const item = await Item.findById(cartItem.itemId).session(session);

      // Create detail
      await InvoiceDetail.create(
        [
          {
            invoiceId,
            itemId: cartItem.itemId,
            quantity: cartItem.quantity,
            price: item.price,
            total: item.price * cartItem.quantity,
          },
        ],
        { session }
      );

      // خصم المخزون
      item.stock -= cartItem.quantity;
      await item.save({ session });

      // تسجيل حركة مخزون
      await StockTransaction.create(
        [
          {
            itemId: cartItem.itemId,
            quantity: -cartItem.quantity,
            movementType: "SALE",
            reference: `ORDER-${invoiceId}`,
            userId,
          },
        ],
        { session }
      );
    }

    // 5) مسح السلة
    cart.items = [];
    await cart.save({ session });

    // 6) Commit
    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(
      { message: "Order completed", invoiceId },
      { status: 201 }
    );
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
