import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";

// GET all notifications
export async function GET() {
  await connectDB();
  const notifications = await Notification.find()
    .populate("userId")
    .sort({ createdAt: -1 });

  return NextResponse.json(notifications);
}

// CREATE notification
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const noti = await Notification.create(body);
    return NextResponse.json(noti, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
