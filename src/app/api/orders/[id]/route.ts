import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import InvoiceHeader from "@/models/InvoiceHeader";
import InvoiceDetails from "@/models/InvoiceDetail";
import Stock from "@/models/Stock";

// GET Order (with details)
export async function GET(req: Request, { params }: any) {
  await connectDB();

  const order = await InvoiceHeader.findById(params.id)
    .populate("userId")
    .populate("paymentMethodId")
    .populate("addressId")
    .populate("statusId");

  const details = await InvoiceDetails.find({ invoiceId: params.id })
    .populate("itemId");

  return NextResponse.json({ order, details });
}

// UPDATE order (status only mostly)
export async function PUT(req: Request, { params }: any) {
  try {
    await connectDB();
    const body = await req.json();

    const updated = await InvoiceHeader.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    return NextResponse.json(updated);

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

// DELETE order (Header + Details)
export async function DELETE(req: Request, { params }: any) {
  try {
    await connectDB();

    await InvoiceHeader.findByIdAndDelete(params.id);
    await InvoiceDetails.deleteMany({ invoiceId: params.id });

    return NextResponse.json({ message: "Order deleted" });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
