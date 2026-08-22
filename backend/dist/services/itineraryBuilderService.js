"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItineraryBuilderService = void 0;
const db_js_1 = require("../config/db.js");
const AppError_js_1 = require("../utils/AppError.js");
class ItineraryBuilderService {
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
    static async createSection(userId, tripId, input) {
        const trip = await this.getTripAndVerifyOwner(userId, tripId);
        const secStart = new Date(input.startDate);
        const secEnd = new Date(input.endDate);
        const tripStart = new Date(trip.startDate);
        const tripEnd = new Date(trip.endDate);
        // Normalize date bounds for day-level comparison
        const secStartDay = new Date(secStart.getFullYear(), secStart.getMonth(), secStart.getDate(), 0, 0, 0);
        const secEndDay = new Date(secEnd.getFullYear(), secEnd.getMonth(), secEnd.getDate(), 23, 59, 59);
        const tripStartDay = new Date(tripStart.getFullYear(), tripStart.getMonth(), tripStart.getDate(), 0, 0, 0);
        const tripEndDay = new Date(tripEnd.getFullYear(), tripEnd.getMonth(), tripEnd.getDate(), 23, 59, 59);
        if (secStartDay < tripStartDay || secEndDay > tripEndDay || secStartDay > secEndDay) {
            throw new AppError_js_1.AppError(`Section dates (${secStart.toISOString().split('T')[0]} to ${secEnd.toISOString().split('T')[0]}) must fall within trip dates (${tripStart.toISOString().split('T')[0]} to ${tripEnd.toISOString().split('T')[0]})`, 400);
        }
        const existingCount = await db_js_1.prisma.itinerarySection.count({
            where: { tripId },
        });
        return await db_js_1.prisma.itinerarySection.create({
            data: {
                tripId,
                title: input.title,
                startDate: secStart,
                endDate: secEnd,
                sectionBudget: input.sectionBudget ?? 0,
                orderIndex: existingCount,
            },
            include: {
                items: true,
            },
        });
    }
    static async updateSection(userId, tripId, sectionId, input) {
        const trip = await this.getTripAndVerifyOwner(userId, tripId);
        const existingSection = await db_js_1.prisma.itinerarySection.findFirst({
            where: { id: sectionId, tripId },
        });
        if (!existingSection) {
            throw new AppError_js_1.AppError('Itinerary section not found', 404);
        }
        const newStart = input.startDate ? new Date(input.startDate) : existingSection.startDate;
        const newEnd = input.endDate ? new Date(input.endDate) : existingSection.endDate;
        const tripStart = new Date(trip.startDate);
        const tripEnd = new Date(trip.endDate);
        const newStartDay = new Date(newStart.getFullYear(), newStart.getMonth(), newStart.getDate(), 0, 0, 0);
        const newEndDay = new Date(newEnd.getFullYear(), newEnd.getMonth(), newEnd.getDate(), 23, 59, 59);
        const tripStartDay = new Date(tripStart.getFullYear(), tripStart.getMonth(), tripStart.getDate(), 0, 0, 0);
        const tripEndDay = new Date(tripEnd.getFullYear(), tripEnd.getMonth(), tripEnd.getDate(), 23, 59, 59);
        if (newStartDay < tripStartDay || newEndDay > tripEndDay || newStartDay > newEndDay) {
            throw new AppError_js_1.AppError(`Section dates must fall within trip dates (${tripStart.toISOString().split('T')[0]} to ${tripEnd.toISOString().split('T')[0]})`, 400);
        }
        return await db_js_1.prisma.itinerarySection.update({
            where: { id: sectionId },
            data: {
                ...(input.title !== undefined && { title: input.title }),
                ...(input.startDate !== undefined && { startDate: newStart }),
                ...(input.endDate !== undefined && { endDate: newEnd }),
                ...(input.sectionBudget !== undefined && { sectionBudget: input.sectionBudget }),
            },
            include: {
                items: true,
            },
        });
    }
    static async deleteSection(userId, tripId, sectionId) {
        await this.getTripAndVerifyOwner(userId, tripId);
        const section = await db_js_1.prisma.itinerarySection.findFirst({
            where: { id: sectionId, tripId },
        });
        if (!section) {
            throw new AppError_js_1.AppError('Itinerary section not found', 404);
        }
        await db_js_1.prisma.itinerarySection.delete({
            where: { id: sectionId },
        });
        return { success: true, message: 'Section deleted successfully' };
    }
    static async addItemToSection(userId, tripId, sectionId, input) {
        await this.getTripAndVerifyOwner(userId, tripId);
        const section = await db_js_1.prisma.itinerarySection.findFirst({
            where: { id: sectionId, tripId },
        });
        if (!section) {
            throw new AppError_js_1.AppError('Itinerary section not found', 404);
        }
        const existingCount = await db_js_1.prisma.itineraryItem.count({
            where: { sectionId },
        });
        const itemDate = input.date ? new Date(input.date) : section.startDate;
        return await db_js_1.prisma.itineraryItem.create({
            data: {
                sectionId,
                activityId: input.activityId ?? null,
                title: input.title,
                notes: input.notes ?? null,
                date: itemDate,
                startTime: input.startTime ?? null,
                cost: input.cost ?? 0,
                orderIndex: existingCount,
            },
            include: {
                activity: true,
            },
        });
    }
    static async removeItem(userId, tripId, itemId) {
        await this.getTripAndVerifyOwner(userId, tripId);
        const item = await db_js_1.prisma.itineraryItem.findUnique({
            where: { id: itemId },
            include: { section: true },
        });
        if (!item || item.section.tripId !== tripId) {
            throw new AppError_js_1.AppError('Itinerary item not found', 404);
        }
        await db_js_1.prisma.itineraryItem.delete({
            where: { id: itemId },
        });
        return { success: true, message: 'Itinerary item removed successfully' };
    }
    static async reorderItems(userId, tripId, sectionId, itemIds) {
        await this.getTripAndVerifyOwner(userId, tripId);
        const section = await db_js_1.prisma.itinerarySection.findFirst({
            where: { id: sectionId, tripId },
        });
        if (!section) {
            throw new AppError_js_1.AppError('Itinerary section not found', 404);
        }
        await db_js_1.prisma.$transaction(itemIds.map((itemId, idx) => db_js_1.prisma.itineraryItem.updateMany({
            where: { id: itemId, sectionId },
            data: { orderIndex: idx },
        })));
        return await db_js_1.prisma.itineraryItem.findMany({
            where: { sectionId },
            orderBy: { orderIndex: 'asc' },
            include: { activity: true },
        });
    }
}
exports.ItineraryBuilderService = ItineraryBuilderService;
