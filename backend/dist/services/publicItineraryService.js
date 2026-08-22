"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicItineraryService = void 0;
const db_js_1 = require("../config/db.js");
const AppError_js_1 = require("../utils/AppError.js");
const crypto_1 = __importDefault(require("crypto"));
class PublicItineraryService {
    static async getTripAndVerifyOwner(userId, tripId) {
        const trip = await db_js_1.prisma.trip.findUnique({
            where: { id: tripId },
        });
        if (!trip) {
            throw new AppError_js_1.AppError('Trip not found', 404);
        }
        if (trip.userId !== userId) {
            throw new AppError_js_1.AppError('Forbidden: You do not own this trip', 403);
        }
        return trip;
    }
    static async generateShareLink(userId, tripId) {
        await this.getTripAndVerifyOwner(userId, tripId);
        // Ensure trip is marked public
        await db_js_1.prisma.trip.update({
            where: { id: tripId },
            data: { isPublic: true },
        });
        const shareToken = crypto_1.default.randomUUID();
        const share = await db_js_1.prisma.tripShare.upsert({
            where: { tripId },
            create: {
                tripId,
                publicToken: shareToken,
                isActive: true,
            },
            update: {
                isActive: true,
            },
        });
        return {
            shareToken: share.publicToken,
            shareUrl: `/share/${share.publicToken}`,
            isActive: share.isActive,
        };
    }
    static async revokeShareLink(userId, tripId) {
        await this.getTripAndVerifyOwner(userId, tripId);
        await db_js_1.prisma.trip.update({
            where: { id: tripId },
            data: { isPublic: false },
        });
        await db_js_1.prisma.tripShare.updateMany({
            where: { tripId },
            data: { isActive: false },
        });
        return { success: true, message: 'Public share link has been revoked' };
    }
    static async getPublicItineraryByToken(token) {
        const share = await db_js_1.prisma.tripShare.findUnique({
            where: { publicToken: token },
            include: {
                trip: {
                    include: {
                        user: {
                            select: { id: true, name: true, avatarUrl: true, bio: true },
                        },
                        stops: { orderBy: { orderIndex: 'asc' } },
                        budget: true,
                        sections: {
                            orderBy: { orderIndex: 'asc' },
                            include: {
                                items: {
                                    orderBy: { orderIndex: 'asc' },
                                    include: {
                                        activity: {
                                            include: { category: true },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!share || !share.isActive || !share.trip || !share.trip.isPublic) {
            throw new AppError_js_1.AppError('Public itinerary not found or access has been revoked', 404);
        }
        const { trip } = share;
        const totalActivitiesCount = trip.sections.reduce((acc, sec) => acc + sec.items.length, 0);
        const totalSpent = trip.sections.reduce((acc, sec) => acc + sec.items.reduce((sum, item) => sum + (item.cost || 0), 0), 0);
        return {
            shareToken: share.publicToken,
            owner: trip.user,
            trip: {
                id: trip.id,
                name: trip.name,
                description: trip.description,
                startDate: trip.startDate,
                endDate: trip.endDate,
                coverImageUrl: trip.coverImageUrl,
                isPublic: trip.isPublic,
                stops: trip.stops,
                totalBudget: trip.budget?.totalBudget || 0,
                totalSpent,
                totalActivitiesCount,
            },
            sections: trip.sections,
        };
    }
    static async getPublicItineraryById(tripId) {
        const trip = await db_js_1.prisma.trip.findUnique({
            where: { id: tripId },
            include: {
                user: {
                    select: { id: true, name: true, avatarUrl: true, bio: true },
                },
                stops: { orderBy: { orderIndex: 'asc' } },
                budget: true,
                sections: {
                    orderBy: { orderIndex: 'asc' },
                    include: {
                        items: {
                            orderBy: { orderIndex: 'asc' },
                            include: {
                                activity: {
                                    include: { category: true },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!trip || !trip.isPublic) {
            throw new AppError_js_1.AppError('Public itinerary not found or trip is set to private', 404);
        }
        const totalActivitiesCount = trip.sections.reduce((acc, sec) => acc + sec.items.length, 0);
        const totalSpent = trip.sections.reduce((acc, sec) => acc + sec.items.reduce((sum, item) => sum + (item.cost || 0), 0), 0);
        return {
            owner: trip.user,
            trip: {
                id: trip.id,
                name: trip.name,
                description: trip.description,
                startDate: trip.startDate,
                endDate: trip.endDate,
                coverImageUrl: trip.coverImageUrl,
                isPublic: trip.isPublic,
                stops: trip.stops,
                totalBudget: trip.budget?.totalBudget || 0,
                totalSpent,
                totalActivitiesCount,
            },
            sections: trip.sections,
        };
    }
    static async copyPublicTrip(userId, identifier) {
        // Check if identifier is token or tripId
        let sourceTrip = await db_js_1.prisma.trip.findFirst({
            where: {
                OR: [
                    { id: identifier, isPublic: true },
                    { share: { publicToken: identifier, isActive: true }, isPublic: true },
                ],
            },
            include: {
                stops: { orderBy: { orderIndex: 'asc' } },
                budget: true,
                sections: {
                    orderBy: { orderIndex: 'asc' },
                    include: {
                        items: { orderBy: { orderIndex: 'asc' } },
                    },
                },
            },
        });
        if (!sourceTrip) {
            throw new AppError_js_1.AppError('Public trip not found or is private', 404);
        }
        // Clone trip in transaction
        const clonedTrip = await db_js_1.prisma.trip.create({
            data: {
                userId,
                name: `Copy of ${sourceTrip.name}`,
                description: sourceTrip.description,
                startDate: sourceTrip.startDate,
                endDate: sourceTrip.endDate,
                coverImageUrl: sourceTrip.coverImageUrl,
                isPublic: false,
                stops: {
                    create: sourceTrip.stops.map((stop) => ({
                        destinationName: stop.destinationName,
                        city: stop.city,
                        country: stop.country,
                        arrivalDate: stop.arrivalDate,
                        departureDate: stop.departureDate,
                        orderIndex: stop.orderIndex,
                    })),
                },
                budget: sourceTrip.budget
                    ? {
                        create: {
                            totalBudget: sourceTrip.budget.totalBudget,
                        },
                    }
                    : undefined,
            },
        });
        // Clone sections and nested items
        for (const sec of sourceTrip.sections) {
            await db_js_1.prisma.itinerarySection.create({
                data: {
                    tripId: clonedTrip.id,
                    title: sec.title,
                    startDate: sec.startDate,
                    endDate: sec.endDate,
                    sectionBudget: sec.sectionBudget,
                    orderIndex: sec.orderIndex,
                    items: {
                        create: sec.items.map((item) => ({
                            activityId: item.activityId,
                            title: item.title,
                            notes: item.notes,
                            date: item.date,
                            startTime: item.startTime,
                            cost: item.cost,
                            orderIndex: item.orderIndex,
                        })),
                    },
                },
            });
        }
        return {
            success: true,
            message: 'Trip copied to your workspace successfully',
            clonedTripId: clonedTrip.id,
        };
    }
}
exports.PublicItineraryService = PublicItineraryService;
