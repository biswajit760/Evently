// lib/actions/eventAnalytics.ts
"use server";

import { connectToDatabase } from "@/lib/database";
import Event from "@/lib/database/models/event.model";
import Order from "@/lib/database/models/order.model";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function getEventAnalytics(eventId: string) {
  await connectToDatabase();

  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // 1️⃣ Fetch event
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  // 2️⃣ Organizer-only access (safe check)
  const organizerId =
    typeof event.organizer === "string"
      ? event.organizer
      : event.organizer?.toString();

  if (organizerId !== userId) {
    throw new Error("Forbidden");
  }

  const eventObjectId = new mongoose.Types.ObjectId(eventId);

  // 3️⃣ Tickets sold + total revenue
  const orderStats = await Order.aggregate([
    {
      $match: {
        event: eventObjectId, // ✅ FIXED
      },
    },
    {
      $group: {
        _id: null,
        ticketsSold: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  // 4️⃣ Sales over time (charts)
  const salesOverTime = await Order.aggregate([
    {
      $match: {
        event: eventObjectId, // ✅ FIXED
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        tickets: { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const ticketsSold = orderStats[0]?.ticketsSold || 0;
  const totalRevenue = orderStats[0]?.totalRevenue || 0;
  const totalViews = event.
viewCount || 0;

  // 5️⃣ Conversion rate
  const conversionRate =
    totalViews > 0
      ? ((ticketsSold / totalViews) * 100).toFixed(2)
      : "0";

  return {
    totalViews,
    ticketsSold,
    totalRevenue,
    conversionRate,
    salesOverTime: salesOverTime.map((item) => ({
      date: item._id,
      tickets: item.tickets,
      revenue: item.revenue,
    })),
  };
}
