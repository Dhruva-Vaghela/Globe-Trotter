import { prisma } from '../config/db.js';
import { TripStatus } from '@prisma/client';

export class DashboardService {
  static async getDashboardSummary(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        preference: true,
      },
    });

    const totalTrips = await prisma.trip.count({
      where: { userId },
    });

    const upcomingTripsCount = await prisma.trip.count({
      where: { userId, status: TripStatus.UPCOMING },
    });

    const completedTripsCount = await prisma.trip.count({
      where: { userId, status: TripStatus.COMPLETED },
    });

    const visitedStops = await prisma.tripStop.findMany({
      where: { trip: { userId } },
      select: { city: true, country: true },
      distinct: ['city'],
    });

    // Total expenses across all user trips
    const expenses = await prisma.expense.aggregate({
      where: { trip: { userId } },
      _sum: { amount: true },
    });

    return {
      user,
      stats: {
        totalTrips,
        upcomingTripsCount,
        completedTripsCount,
        visitedCitiesCount: visitedStops.length,
        totalExpenses: expenses._sum.amount || 0,
      },
    };
  }

  static async getUserTrips(userId: string) {
    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { startDate: 'asc' },
      include: {
        stops: { orderBy: { orderIndex: 'asc' } },
        budget: true,
        expenses: true,
        _count: { select: { sections: true } },
      },
    });

    const upcomingTrips = trips.filter((t) => t.status === TripStatus.UPCOMING);
    const ongoingTrips = trips.filter((t) => t.status === TripStatus.ONGOING);
    const previousTrips = trips.filter((t) => t.status === TripStatus.COMPLETED);

    return {
      allTrips: trips,
      upcomingTrips,
      ongoingTrips,
      previousTrips,
      recentTrip: trips[0] || null,
    };
  }

  static async getPopularDestinations() {
    const activities = await prisma.activity.findMany({
      take: 10,
      orderBy: { rating: 'desc' },
      include: { category: true },
    });

    return activities;
  }

  static async getRecommendedContent(userId?: string) {
    const recommendedActivities = await prisma.activity.findMany({
      take: 6,
      orderBy: { rating: 'desc' },
      include: { category: true },
    });

    const communityPosts = await prisma.communityPost.findMany({
      where: { isPublished: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, avatarUrl: true } },
        trip: {
          select: {
            name: true,
            coverImageUrl: true,
            stops: true,
            budget: true,
          },
        },
      },
    });

    return {
      recommendedActivities,
      communityPosts,
    };
  }
}
