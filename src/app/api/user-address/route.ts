import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import UserAddress from "@/models/UserAddress";

// GET all addresses for user
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

  const addresses = await UserAddress.find({ userId }).sort({
    createdAt: -1,
  });

  return NextResponse.json(addresses);
}

// CREATE new address
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const address = await UserAddress.create(body);

    // If this isDefault = true, reset others
    if (address.isDefault) {
      await UserAddress.updateMany(
        { userId: address.userId, _id: { $ne: address._id } },
        { isDefault: false }
      );
    }

    return NextResponse.json(address, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
