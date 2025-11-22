import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import InvoiceHeader from "@/models/InvoiceHeader";
import InvoiceDetails from "@/models/InvoiceDetail";
import Stock from "@/models/Stock";

// GET all orders
export async function GET() {
  await connectDB();

  const orders = await InvoiceHeader.find()
    .populate("userId")
    .populate("paymentMethodId")
    .populate("addressId")
    .populate("statusId")
    .sort({ createdAt: -1 });

  return NextResponse.json(orders);
}

// CREATE order (Header + Details)
export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      userId,
      paymentMethodId,
      addressId,
      items,
      discount = 0,
      statusId,
    } = await req.json();

    if (!items || items.length === 0)
      return NextResponse.json(
        { message: "Order must include items" },
        { status: 400 }
      );

    // 1️⃣ حساب الإجمالي
    let total = 0;
    items.forEach((i: any) => {
      total += i.price * i.quantity;
    });

    const finalTotal = total - discount;

    // 2️⃣ إنشاء الـ InvoiceHeader
    const orderHeader = await InvoiceHeader.create({
      userId,
      paymentMethodId,
      addressId,
      statusId,
      total,
      discount,
      finalTotal,
    });

    // 3️⃣ إنشاء InvoiceDetails
    for (const item of items) {
      await InvoiceDetails.create({
        invoiceId: orderHeader._id,
        itemId: item.itemId,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      });

      // 4️⃣ تقليل المخزون Stock
      const stock = await Stock.findOne({ itemId: item.itemId });
      if (stock) {
        stock.quantity -= item.quantity;
        if (stock.quantity < 0) stock.quantity = 0;
        await stock.save();
      }
    }

    return NextResponse.json(
      { message: "Order created", orderId: orderHeader._id },
      { status: 201 }
    );

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
