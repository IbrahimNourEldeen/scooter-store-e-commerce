import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import InvoiceHeader from "@/models/InvoiceHeader";
import InvoiceDetail from "@/models/InvoiceDetail";

// GET order by id
export async function GET(req: Request, { params }: any) {
  await connectDB();

  const header = await InvoiceHeader.findById(params.id)
    .populate("userId", "name email")
    .populate("paymentMethodId")
    .populate("statusId")
    .populate("addressId");

  const details = await InvoiceDetail.find({ invoiceId: params.id }).populate(
    "itemId"
  );

  return NextResponse.json({
    header,
    details,
  });
}

// UPDATE order status
export async function PUT(req: Request, { params }: any) {
  try {
    await connectDB();
    const body = await req.json();

    const updated = await InvoiceHeader.findByIdAndUpdate(
      params.id,
      { statusId: body.statusId },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

// DELETE order
export async function DELETE(req: Request, { params }: any) {
  try {
    await connectDB();

    await InvoiceHeader.findByIdAndDelete(params.id);
    await InvoiceDetail.deleteMany({ invoiceId: params.id });

    return NextResponse.json({ message: "Order deleted" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
