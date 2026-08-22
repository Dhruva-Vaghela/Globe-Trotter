"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const db_js_1 = require("../config/db.js");
const client_1 = require("@prisma/client");
class DashboardService {
    static async getDashboardSummary(userId) {
        const user = await db_js_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                preference: true,
            },
        });
        const totalTrips = await db_js_1.prisma.trip.count({
            where: { userId },
        });
        const upcomingTripsCount = await db_js_1.prisma.trip.count({
            where: { userId, status: client_1.TripStatus.UPCOMING },
        });
        const completedTripsCount = await db_js_1.prisma.trip.count({
            where: { userId, status: client_1.TripStatus.COMPLETED },
        });
        const visitedStops = await db_js_1.prisma.tripStop.findMany({
            where: { trip: { userId } },
            select: { city: true, country: true },
            distinct: ['city'],
        });
        // Total expenses across all user trips
        const expenses = await db_js_1.prisma.expense.aggregate({
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
    static async getUserTrips(userId) {
        const trips = await db_js_1.prisma.trip.findMany({
            where: { userId },
            orderBy: { startDate: 'asc' },
            include: {
                stops: { orderBy: { orderIndex: 'asc' } },
                budget: true,
                expenses: true,
                _count: { select: { sections: true } },
            },
        });
        const upcomingTrips = trips.filter((t) => t.status === client_1.TripStatus.UPCOMING);
        const ongoingTrips = trips.filter((t) => t.status === client_1.TripStatus.ONGOING);
        const previousTrips = trips.filter((t) => t.status === client_1.TripStatus.COMPLETED);
        return {
            allTrips: trips,
            upcomingTrips,
            ongoingTrips,
            previousTrips,
            recentTrip: trips[0] || null,
        };
    }
    static async getPopularDestinations() {
        const activities = await db_js_1.prisma.activity.findMany({
            take: 10,
            orderBy: { rating: 'desc' },
            include: { category: true },
        });
        return activities;
    }
    static async getRecommendedContent(userId) {
        const recommendedActivities = await db_js_1.prisma.activity.findMany({
            take: 6,
            orderBy: { rating: 'desc' },
            include: { category: true },
        });
        const communityPosts = await db_js_1.prisma.communityPost.findMany({
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
exports.DashboardService = DashboardService;
