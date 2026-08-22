import { prisma } from '../config/db.js';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError.js';

export interface ActivityQuery {
  search?: string;
  category?: string;
  location?: string;
  maxCost?: number;
  maxDuration?: number;
  minRating?: number;
  sortBy?: 'rating' | 'cost_asc' | 'cost_desc' | 'duration';
  sortOrder?: 'asc' | 'desc';
}

export interface AddActivityInput {
  activityId?: string;
  title?: string;
  notes?: string;
  date?: string | Date;
  startTime?: string;
  cost?: number;
}

export class ActivityService {
  static async listActivities(query: ActivityQuery = {}) {
    const {
      search,
      category,
      location,
      maxCost,
      maxDuration,
      minRating,
      sortBy = 'rating',
      sortOrder = 'desc',
    } = query;

    const where: Prisma.ActivityWhereInput = {};

    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { locationName: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    if (category && category.trim() !== '' && category !== 'all') {
      where.OR = [
        { categoryId: category },
        { category: { name: { contains: category, mode: 'insensitive' } } },
      ];
    }

    if (location && location.trim() !== '') {
      where.locationName = { contains: location.trim(), mode: 'insensitive' };
    }

    if (maxCost !== undefined && !isNaN(Number(maxCost))) {
      where.estimatedCost = { lte: Number(maxCost) };
    }

    if (maxDuration !== undefined && !isNaN(Number(maxDuration))) {
      where.durationMinutes = { lte: Number(maxDuration) };
    }

    if (minRating !== undefined && !isNaN(Number(minRating))) {
      where.rating = { gte: Number(minRating) };
    }

    let orderBy: Prisma.ActivityOrderByWithRelationInput = { rating: sortOrder };

    if (sortBy === 'rating') {
      orderBy = { rating: sortOrder };
    } else if (sortBy === 'cost_asc') {
      orderBy = { estimatedCost: 'asc' };
    } else if (sortBy === 'cost_desc') {
      orderBy = { estimatedCost: 'desc' };
    } else if (sortBy === 'duration') {
      orderBy = { durationMinutes: sortOrder };
    }

    const activities = await prisma.activity.findMany({
      where,
      orderBy,
      include: {
        category: true,
      },
    });

    return activities;
  }

  static async getActivityById(id: string) {
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!activity) {
      throw new AppError('Activity not found', 404);
    }

    const hours = Math.floor(activity.durationMinutes / 60);
    const mins = activity.durationMinutes % 60;
    const formattedDuration =
      hours > 0
        ? `${hours} Hour${hours > 1 ? 's' : ''}${mins > 0 ? ` ${mins} Mins` : ''}`
        : `${mins} Mins`;

    let suitableFor = 'Full-day experience';
    if (activity.durationMinutes <= 120) {
      suitableFor = 'Quick 1-2 hour highlight';
    } else if (activity.durationMinutes <= 240) {
      suitableFor = 'Half-day morning or afternoon';
    }

    const durationBreakdown = {
      hours,
      minutes: mins,
      totalMinutes: activity.durationMinutes,
      formatted: formattedDuration,
      suitableFor,
    };

    const locationMap = {
      formattedAddress: activity.locationName,
      city: activity.locationName.split(',')[0]?.trim() || activity.locationName,
      country: activity.locationName.split(',')[1]?.trim() || 'Global',
      isPopularDestination: true,
    };

    return {
      ...activity,
      durationBreakdown,
      locationMap,
    };
  }

  static async addActivityToSection(
    userId: string,
    tripId: string,
    sectionId: string,
    input: AddActivityInput
  ) {
    const section = await prisma.itinerarySection.findUnique({
      where: { id: sectionId },
      include: { trip: true, items: true },
    });

    if (!section) {
      throw new AppError('Itinerary section not found', 404);
    }

    if (section.tripId !== tripId) {
      throw new AppError('Itinerary section does not belong to the specified trip', 400);
    }

    if (section.trip.userId !== userId) {
      throw new AppError('Forbidden: You do not own this trip', 403);
    }

    let activity = null;
    if (input.activityId) {
      activity = await prisma.activity.findUnique({
        where: { id: input.activityId },
      });
      if (!activity) {
        throw new AppError('Referenced Activity not found', 404);
      }
    }

    const title = input.title || activity?.name || 'New Activity';
    const cost = input.cost !== undefined ? Number(input.cost) : activity?.estimatedCost || 0.0;
    const date = input.date ? new Date(input.date) : section.startDate;
    const orderIndex = section.items.length;

    const item = await prisma.itineraryItem.create({
      data: {
        sectionId,
        activityId: input.activityId || null,
        title,
        notes: input.notes || null,
        date,
        startTime: input.startTime || null,
        cost,
        orderIndex,
      },
      include: {
        activity: {
          include: { category: true },
        },
      },
    });

    return item;
  }

  static async removeItineraryItem(userId: string, tripId: string, itemId: string) {
    const item = await prisma.itineraryItem.findUnique({
      where: { id: itemId },
      include: {
        section: {
          include: { trip: true },
        },
      },
    });

    if (!item) {
      throw new AppError('Itinerary item not found', 404);
    }

    if (item.section.tripId !== tripId) {
      throw new AppError('Itinerary item does not belong to the specified trip', 400);
    }

    if (item.section.trip.userId !== userId) {
      throw new AppError('Forbidden: You do not own this trip', 403);
    }

    await prisma.itineraryItem.delete({
      where: { id: itemId },
    });
  }

  static async reorderItineraryItems(
    userId: string,
    tripId: string,
    sectionId: string,
    itemIds: string[]
  ) {
    const section = await prisma.itinerarySection.findUnique({
      where: { id: sectionId },
      include: { trip: true },
    });

    if (!section) {
      throw new AppError('Itinerary section not found', 404);
    }

    if (section.tripId !== tripId) {
      throw new AppError('Itinerary section does not belong to specified trip', 400);
    }

    if (section.trip.userId !== userId) {
      throw new AppError('Forbidden: You do not own this trip', 403);
    }

    const updates = itemIds.map((id, index) =>
      prisma.itineraryItem.update({
        where: { id },
        data: { orderIndex: index },
      })
    );

    await prisma.$transaction(updates);

    const reorderedItems = await prisma.itineraryItem.findMany({
      where: { sectionId },
      orderBy: { orderIndex: 'asc' },
      include: { activity: true },
    });

    return reorderedItems;
  }
}
