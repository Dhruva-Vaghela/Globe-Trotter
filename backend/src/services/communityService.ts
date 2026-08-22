import { prisma } from '../config/db.js';
import { Prisma, TripStatus } from '@prisma/client';
import { AppError } from '../utils/AppError.js';

export interface CommunityFeedQuery {
  search?: string;
  city?: string;
  sortBy?: 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface PublishTripInput {
  title?: string;
  content?: string;
}

export class CommunityService {
  static async getCommunityFeed(query: CommunityFeedQuery = {}) {
    const { search, city, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: Prisma.TripWhereInput = {
      isPublic: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { communityPost: { title: { contains: search, mode: 'insensitive' } } },
          { communityPost: { content: { contains: search, mode: 'insensitive' } } },
        ],
      }),
      ...(city && {
        stops: {
          some: {
            city: { contains: city, mode: 'insensitive' },
          },
        },
      }),
    };

    const trips = await prisma.trip.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true, bio: true },
        },
        stops: { orderBy: { orderIndex: 'asc' } },
        budget: true,
        communityPost: true,
        sections: {
          orderBy: { orderIndex: 'asc' },
          include: {
            items: {
              include: { activity: true },
            },
          },
        },
      },
    });

    return trips.map((trip) => {
      const totalActivities = trip.sections.reduce((acc, sec) => acc + sec.items.length, 0);
      const totalEstCost = trip.sections.reduce(
        (acc, sec) => acc + sec.items.reduce((sum, item) => sum + item.cost, 0),
        0
      );

      return {
        id: trip.id,
        name: trip.name,
        description: trip.description,
        coverImageUrl: trip.coverImageUrl,
        startDate: trip.startDate,
        endDate: trip.endDate,
        status: trip.status,
        user: trip.user,
        stops: trip.stops,
        communityPost: trip.communityPost,
        totalSections: trip.sections.length,
        totalActivities,
        totalEstCost,
      };
    });
  }

  static async getPublicTripDetails(tripId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true, bio: true },
        },
        stops: { orderBy: { orderIndex: 'asc' } },
        budget: true,
        communityPost: true,
        sections: {
          orderBy: { orderIndex: 'asc' },
          include: {
            items: {
              orderBy: { orderIndex: 'asc' },
              include: { activity: { include: { category: true } } },
            },
          },
        },
      },
    });

    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    if (!trip.isPublic) {
      throw new AppError('This trip is private and not published to community', 403);
    }

    return trip;
  }

  static async publishTrip(userId: string, tripId: string, input: PublishTripInput = {}) {
    const existing = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!existing) throw new AppError('Trip not found', 404);
    if (existing.userId !== userId) throw new AppError('Forbidden: You do not own this trip', 403);

    const title = input.title || existing.name;
    const content = input.content || existing.description || 'Check out my trip itinerary on GlobeTrotter!';

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: { isPublic: true },
    });

    const post = await prisma.communityPost.upsert({
      where: { tripId },
      update: {
        title,
        content,
        isPublished: true,
      },
      create: {
        userId,
        tripId,
        title,
        content,
        isPublished: true,
      },
    });

    return {
      trip: updatedTrip,
      post,
    };
  }

  static async unpublishTrip(userId: string, tripId: string) {
    const existing = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!existing) throw new AppError('Trip not found', 404);
    if (existing.userId !== userId) throw new AppError('Forbidden: You do not own this trip', 403);

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: { isPublic: false },
    });

    await prisma.communityPost.updateMany({
      where: { tripId },
      data: { isPublished: false },
    });

    return updatedTrip;
  }

  static async copyTrip(userId: string, targetTripId: string) {
    const targetTrip = await prisma.trip.findUnique({
      where: { id: targetTripId },
      include: {
        stops: { orderBy: { orderIndex: 'asc' } },
        sections: {
          orderBy: { orderIndex: 'asc' },
          include: { items: { orderBy: { orderIndex: 'asc' } } },
        },
      },
    });

    if (!targetTrip) throw new AppError('Target trip not found', 404);
    if (!targetTrip.isPublic && targetTrip.userId !== userId) {
      throw new AppError('Cannot copy private trip', 403);
    }

    const startDate = new Date();
    const durationMs = targetTrip.endDate.getTime() - targetTrip.startDate.getTime();
    const endDate = new Date(startDate.getTime() + (durationMs > 0 ? durationMs : 86400000 * 3));

    // Duplicate trip structure
    const newTrip = await prisma.trip.create({
      data: {
        userId,
        name: `Copy of ${targetTrip.name}`,
        description: targetTrip.description,
        startDate,
        endDate,
        coverImageUrl: targetTrip.coverImageUrl,
        status: TripStatus.UPCOMING,
        isPublic: false,
        stops: {
          create: targetTrip.stops.map((stop) => ({
            destinationName: stop.destinationName,
            city: stop.city,
            country: stop.country,
            arrivalDate: startDate,
            departureDate: endDate,
            orderIndex: stop.orderIndex,
          })),
        },
        sections: {
          create: targetTrip.sections.map((sec) => ({
            title: sec.title,
            startDate,
            endDate,
            sectionBudget: sec.sectionBudget,
            orderIndex: sec.orderIndex,
            items: {
              create: sec.items.map((item) => ({
                activityId: item.activityId,
                title: item.title,
                notes: item.notes,
                date: startDate,
                startTime: item.startTime,
                cost: item.cost,
                orderIndex: item.orderIndex,
              })),
            },
          })),
        },
      },
      include: {
        stops: true,
        sections: { include: { items: true } },
      },
    });

    return newTrip;
  }

  static async deleteCommunityPost(userId: string, postId: string) {
    const post = await prisma.communityPost.findUnique({ where: { id: postId } });
    if (!post) throw new AppError('Community post not found', 404);
    if (post.userId !== userId) throw new AppError('Forbidden: Unauthorized to delete post', 403);

    await prisma.communityPost.delete({ where: { id: postId } });
  }
}
