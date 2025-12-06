import { NextRequest, NextResponse } from 'next/server';
import InvoiceHeader from '@/models/InvoiceHeader';
import InvoiceDetail from '@/models/InvoiceDetail';
import dbConnect from '@/lib/db';

export async function GET() {
  await dbConnect();
  const headers = await InvoiceHeader.find().lean();
  const details = await InvoiceDetail.find().lean();
  return NextResponse.json({ headers, details });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();

  // data expected: { header: {...}, details: [...] }
  const header = await InvoiceHeader.create(data.header);
  const details = await InvoiceDetail.insertMany(
    data.details.map(d => ({ ...d, invoice_id: header._id }))
  );

  return NextResponse.json({ header, details });
}
