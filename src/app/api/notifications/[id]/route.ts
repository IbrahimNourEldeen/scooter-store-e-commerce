import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";

// GET one
export async function GET(req: Request, { params }: any) {
  await connectDB();
  const noti = await Notification.findById(params.id);
  return NextResponse.json(noti);
}

// UPDATE (mark read)
export async function PUT(req: Request, { params }: any) {
  try {
    await connectDB();
    const body = await req.json();

    const updated = await Notification.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    return NextResponse.json(updated);

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

// DELETE
export async function DELETE(req: Request, { params }: any) {
  try {
    await connectDB();
    await Notification.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Notification deleted" });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
