'use server'

import { CreateEventParams, DeleteEventParams, GetAllEventsParams, GetEventsByUserParams, GetRelatedEventsByCategoryParams, UpdateEventParams } from "@/types";
import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import Event from "@/lib/database/models/event.model";
import Category from "@/lib/database/models/category.model";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { handleError } from "@/lib/utils";
import orderModel from "../database/models/order.model";

// HELPER: POPULATE CATEGORY + ORGANIZER
const populateEvents = async (query: any) => {
  return query
    .populate({ path: "category", model: Category, select: "_id name" })
    .populate({ path: "organizer", model: User, select: "_id firstName lastName" });
}

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: 'i' } })
}

// CREATE
export async function createEvent({ userId, event, path }: CreateEventParams) {
  try {
    await connectToDatabase();

    const organizer = await User.findById(userId);
    if (!organizer) {
      throw new Error("organizer not found");
    }

    const newEvent = await Event.create({
      ...event,
      category: event.categoryId,
      organizer: userId,
    });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    handleError(error);
  }
}

// GET BY ID
export async function getEventById(eventId : string) {
// export async function getEventById({ eventId }: { eventId: string }) {
  try {
    await connectToDatabase();

    const query = Event.findById(eventId);
    const populatedEvent = await populateEvents(query);

    if (!populatedEvent) {
      throw new Error("Event not found");
    }

    return JSON.parse(JSON.stringify(populatedEvent));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    await connectToDatabase();

    // 1. Check if event exists
    const eventToUpdate = await Event.findById(event._id);
    
    // 2. Authorization check
    if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
      throw new Error("Unauthorized or event not found");
    }

    // 3. Update (Map categoryId -> category)
    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event, category: event.categoryId },
      { new: true }
    );
    
    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedEvent));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    await connectToDatabase();

    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (deletedEvent) revalidatePath(path);
    
  } catch (error) {
    handleError(error);
  }
}

// GET ALL
export async function getAllEvents({ query, limit = 6, page, category }: GetAllEventsParams) {
  try {
    await connectToDatabase();

    const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
    const categoryCondition = category ? await getCategoryByName(category) : null
    const conditions = {
      $and: [titleCondition, categoryCondition ? { category: categoryCondition._id } : {}],
    }
    const skipAmount = (Number(page) - 1) * limit

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skipAmount);
    const events = await populateEvents(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    await connectToDatabase()

    const skipAmount = (Number(page) - 1) * limit
    const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] } as any

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvents(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
  } catch (error) {
    handleError(error)
  }
}


export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
  try {
    await connectToDatabase()

    const conditions = { organizer: userId }
    const skipAmount = (page - 1) * limit

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvents(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
  } catch (error) {
    handleError(error)
  }
}

export async function incrementEventView(eventId: string){
  try {
    await connectToDatabase()
    await Event.findByIdAndUpdate(eventId, { $inc: { viewCount: 1 } }, // atomic increment
      { new: true });
  } catch (error) {
    console.error("Error incrementing view count:", error);
  }
}

// --- Types ---
export type EventAnalytics = {
  totalRevenue: number;
  totalOrders: number;
  views: number;
  conversionRate: number;
  capacity: number;
};

export type ChartData = {
  date: string;
  totalSales: number;
};

// --- Function 1: Get Summary Stats ---
export async function getEventAnalytics(eventId: string): Promise<EventAnalytics> {
  try {
    await connectToDatabase();
    const eventObjectId = new ObjectId(eventId);

    // 1. Aggregation Pipeline on Orders for Revenue/Count
    const ordersStats = await orderModel.aggregate([
      { $match: { event: eventObjectId } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    // 2. Fetch Event Data for Views/Capacity
    const event = await Event.findById(eventObjectId).select("views capacity");
    if (!event) throw new Error("Event not found");

    // 3. Extract values (default to 0)
    const totalRevenue = ordersStats[0]?.totalRevenue || 0;
    const totalOrders = ordersStats[0]?.totalOrders || 0;
    const views = event.views || 0;
    const capacity = event.capacity || 0;

    // 4. Calculate Conversion Rate
    const conversionRate = views > 0 ? (totalOrders / views) * 100 : 0;

    return {
      totalRevenue,
      totalOrders,
      views,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      capacity,
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw new Error("Failed to fetch event analytics");
  }
}

// --- Function 2: Get Chart Data (Last 7 Days) ---
export async function getEventOrdersByDay(eventId: string): Promise<ChartData[]> {
  try {
    await connectToDatabase();
    const eventObjectId = new ObjectId(eventId);

    // 1. Group orders by Created Date (YYYY-MM-DD)
    const rawStats = await orderModel.aggregate([
      { $match: { event: eventObjectId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$totalAmount" },
        },
      },
    ]);

    // 2. Generate Last 7 Days Array (to fill empty days with 0)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    }).reverse();

    // 3. Merge DB data with Date Array
    return last7Days.map((date) => {
      const dayStat = rawStats.find((stat) => stat._id === date);
      return {
        date,
        totalSales: dayStat ? dayStat.totalSales : 0,
      };
    });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return [];
  }
}