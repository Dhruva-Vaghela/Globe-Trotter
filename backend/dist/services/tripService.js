"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripService = void 0;
const db_js_1 = require("../config/db.js");
const client_1 = require("@prisma/client");
const AppError_js_1 = require("../utils/AppError.js");
class TripService {
    static calculateTripStatus(startDate, endDate) {
        const now = new Date();
        if (now < startDate)
            return client_1.TripStatus.UPCOMING;
        if (now > endDate)
            return client_1.TripStatus.COMPLETED;
        return client_1.TripStatus.ONGOING;
    }
    static async createTrip(userId, input) {
        const start = new Date(input.startDate);
        const end = new Date(input.endDate);
        if (end < start) {
            throw new AppError_js_1.AppError('End date cannot be earlier than start date', 400);
        }
        const status = this.calculateTripStatus(start, end);
        const defaultCover = input.coverImageUrl ||
            'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80';
        const city = input.destinationCity || 'Goa';
        const country = input.destinationCountry || 'India';
        const trip = await db_js_1.prisma.trip.create({
            data: {
                userId,
                name: input.name,
                description: input.description,
                startDate: start,
                endDate: end,
                coverImageUrl: defaultCover,
                status,
                isPublic: input.isPublic ?? false,
                stops: {
                    create: [
                        {
                            destinationName: `${city} Main Stop`,
                            city,
                            country,
                            arrivalDate: start,
                            departureDate: end,
                            orderIndex: 0,
                        },
                    ],
                },
                budget: input.totalBudget
                    ? {
                        create: {
                            totalBudget: input.totalBudget,
                        },
                    }
                    : undefined,
                sections: {
                    create: [
                        {
                            title: 'Day 1: Arrival & Exploration',
                            startDate: start,
                            endDate: start,
                            orderIndex: 0,
                        },
                    ],
                },
            },
            include: {
                stops: true,
                budget: true,
                sections: { include: { items: true } },
            },
        });
        return trip;
    }
    static async getTripById(userId, tripId) {
        const trip = await db_js_1.prisma.trip.findUnique({
            where: { id: tripId },
            include: {
                stops: { orderBy: { orderIndex: 'asc' } },
                sections: {
                    orderBy: { orderIndex: 'asc' },
                    include: { items: { orderBy: { orderIndex: 'asc' }, include: { activity: true } } },
                },
                expenses: { orderBy: { date: 'desc' } },
                budget: true,
                user: { select: { id: true, name: true, avatarUrl: true } },
            },
        });
        if (!trip)
            throw new AppError_js_1.AppError('Trip not found', 404);
        if (trip.userId !== userId && !trip.isPublic) {
            throw new AppError_js_1.AppError('Forbidden: You do not have access to this private trip', 403);
        }
        return trip;
    }
    static async listUserTrips(userId, query = {}) {
        const { search, status, sortBy = 'startDate', sortOrder = 'asc' } = query;
        const where = {
            userId,
            ...(status && { status }),
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { stops: { some: { city: { contains: search, mode: 'insensitive' } } } },
                ],
            }),
        };
        const trips = await db_js_1.prisma.trip.findMany({
            where,
            orderBy: { [sortBy]: sortOrder },
            include: {
                stops: { orderBy: { orderIndex: 'asc' } },
                budget: true,
                expenses: true,
                _count: { select: { sections: true } },
            },
        });
        return trips;
    }
    static async updateTrip(userId, tripId, input) {
        const existing = await db_js_1.prisma.trip.findUnique({ where: { id: tripId } });
        if (!existing)
            throw new AppError_js_1.AppError('Trip not found', 404);
        if (existing.userId !== userId)
            throw new AppError_js_1.AppError('Forbidden: Unauthorized to update trip', 403);
        const start = input.startDate ? new Date(input.startDate) : existing.startDate;
        const end = input.endDate ? new Date(input.endDate) : existing.endDate;
        if (end < start) {
            throw new AppError_js_1.AppError('End date cannot be earlier than start date', 400);
        }
        const calculatedStatus = input.status || this.calculateTripStatus(start, end);
        const updated = await db_js_1.prisma.trip.update({
            where: { id: tripId },
            data: {
                ...(input.name && { name: input.name }),
                ...(input.description !== undefined && { description: input.description }),
                startDate: start,
                endDate: end,
                status: calculatedStatus,
                ...(input.coverImageUrl !== undefined && { coverImageUrl: input.coverImageUrl }),
                ...(input.isPublic !== undefined && { isPublic: input.isPublic }),
            },
            include: {
                stops: true,
                budget: true,
                sections: true,
            },
        });
        if (input.totalBudget !== undefined) {
            await db_js_1.prisma.budget.upsert({
                where: { tripId },
                update: { totalBudget: input.totalBudget },
                create: { tripId, totalBudget: input.totalBudget },
            });
        }
        return updated;
    }
    static async deleteTrip(userId, tripId) {
        const existing = await db_js_1.prisma.trip.findUnique({ where: { id: tripId } });
        if (!existing)
            throw new AppError_js_1.AppError('Trip not found', 404);
        if (existing.userId !== userId)
            throw new AppError_js_1.AppError('Forbidden: Unauthorized to delete trip', 403);
        await db_js_1.prisma.trip.delete({
            where: { id: tripId },
        });
    }
}
exports.TripService = TripService;
