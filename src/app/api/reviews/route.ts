import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";


// GET reviews by itemId
export async function GET(req: Request) {
  await connectDB();

  const url = new URL(req.url);
  const itemId = url.searchParams.get("itemId");

  if (!itemId) {
    return NextResponse.json(
      { message: "itemId is required" },
      { status: 400 }
    );
  }

  const reviews = await Review.find({ itemId })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  return NextResponse.json(reviews);
}


// CREATE review
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const review = await Review.create(body);

    return NextResponse.json(review, { status: 201 });

  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 400 }
    );
  }
}
