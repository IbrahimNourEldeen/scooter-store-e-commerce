import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";


// GET single review
export async function GET(req: Request, { params }: any) {
  await connectDB();

  const review = await Review.findById(params.id).populate(
    "userId",
    "name email"
  );

  return NextResponse.json(review);
}


// UPDATE review
export async function PUT(req: Request, { params }: any) {
  try {
    await connectDB();

    const body = await req.json();

    const updated = await Review.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    return NextResponse.json(updated);

  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 400 }
    );
  }
}


// DELETE review
export async function DELETE(req: Request, { params }: any) {
  try {
    await connectDB();

    await Review.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Review deleted" });

  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 400 }
    );
  }
}
