import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import InvoiceHeader from '@/models/InvoiceHeader';
import InvoiceDetail from '@/models/InvoiceDetail';
import Stock from '@/models/Stock';
import Item from '@/models/Item';
import Notification from '@/models/Notification';

export async function GET() {
  await dbConnect();

  const totalUsers = await User.countDocuments();
  const totalOrders = await InvoiceHeader.countDocuments();
  const totalSalesAgg = await InvoiceHeader.aggregate([
    { $group: { _id: null, total: { $sum: "$total_amount" } } }
  ]);
  const totalSales = totalSalesAgg[0]?.total || 0;

  const stockStats = await Stock.aggregate([
    { $group: { _id: "$item_id", qty: { $sum: "$quantity" } } },
    { $sort: { qty: 1 } }
  ]);

  const lowestStockItem = await Item.findById(stockStats[0]?._id);
  const highestStockItem = await Item.findById(stockStats[stockStats.length - 1]?._id);

  const topSellingAgg = await InvoiceDetail.aggregate([
    { $group: { _id: "$item_id", totalQty: { $sum: "$quantity" } } },
    { $sort: { totalQty: -1 } },
    { $limit: 5 }
  ]);

  const topSellingItems = await Item.find({ _id: { $in: topSellingAgg.map(i => i._id) } });

  const notificationsCount = await Notification.countDocuments();

  return NextResponse.json({
    totalUsers,
    totalOrders,
    totalSales,
    lowestStockItem,
    highestStockItem,
    topSellingItems,
    notificationsCount
  });
}
