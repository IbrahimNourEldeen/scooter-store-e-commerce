import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import UserAddress from "@/models/UserAddress";

// GET single address
export async function GET(req: Request, { params }: any) {
  await connectDB();

  const address = await UserAddress.findById(params.id);
  return NextResponse.json(address);
}

// UPDATE address
export async function PUT(req: Request, { params }: any) {
  try {
    await connectDB();
    const body = await req.json();

    const updated = await UserAddress.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    // If changed to default → turn off default for others
    if (body.isDefault === true) {
      await UserAddress.updateMany(
        { userId: updated.userId, _id: { $ne: updated._id } },
        { isDefault: false }
      );
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

// DELETE address
export async function DELETE(req: Request, { params }: any) {
  try {
    await connectDB();

    await UserAddress.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Address deleted" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
