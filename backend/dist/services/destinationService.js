"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DestinationService = void 0;
const db_js_1 = require("../config/db.js");
const AppError_js_1 = require("../utils/AppError.js");
class DestinationService {
    static async listDestinations(query = {}) {
        const { search, country, region, maxCost, minRating, sortBy = 'popularity', sortOrder } = query;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { country: { contains: search, mode: 'insensitive' } },
                { region: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { tags: { hasSome: [search] } },
            ];
        }
        if (country && country !== 'All') {
            where.country = { equals: country, mode: 'insensitive' };
        }
        if (region && region !== 'All') {
            where.region = { equals: region, mode: 'insensitive' };
        }
        if (maxCost !== undefined && maxCost !== null && maxCost !== '') {
            const parsedMaxCost = Number(maxCost);
            if (!isNaN(parsedMaxCost) && parsedMaxCost > 0) {
                where.estimatedDailyCost = { lte: parsedMaxCost };
            }
        }
        if (minRating !== undefined && minRating !== null && minRating !== '') {
            const parsedMinRating = Number(minRating);
            if (!isNaN(parsedMinRating) && parsedMinRating > 0) {
                where.rating = { gte: parsedMinRating };
            }
        }
        let orderBy = { rating: 'desc' };
        if (sortBy === 'cost_asc') {
            orderBy = { estimatedDailyCost: 'asc' };
        }
        else if (sortBy === 'cost_desc') {
            orderBy = { estimatedDailyCost: 'desc' };
        }
        else if (sortBy === 'rating' || sortBy === 'popularity') {
            orderBy = { rating: sortOrder || 'desc' };
        }
        else if (sortBy === 'name') {
            orderBy = { name: sortOrder || 'asc' };
        }
        const destinations = await db_js_1.prisma.destination.findMany({
            where,
            orderBy,
        });
        return destinations;
    }
    static async getDestinationById(id) {
        const destination = await db_js_1.prisma.destination.findUnique({
            where: { id },
        });
        if (!destination) {
            throw new AppError_js_1.AppError('Destination not found', 404);
        }
        // Recommended activities matching destination name or country
        const recommendedActivities = await db_js_1.prisma.activity.findMany({
            where: {
                OR: [
                    { locationName: { contains: destination.name, mode: 'insensitive' } },
                    { locationName: { contains: destination.country, mode: 'insensitive' } },
                ],
            },
            take: 6,
        });
        // Travel tips tailored for destination
        const travelTips = [
            `Best time to visit ${destination.name}: October through April for optimal weather.`,
            `Average daily budget is estimated around $${destination.estimatedDailyCost} per traveler.`,
            `Local transport: Rideshare apps, local taxis, and public transit are widely available.`,
            `Culture & Etiquette: Respect local customs, especially when visiting heritage & religious sites.`,
        ];
        return {
            ...destination,
            recommendedActivities,
            travelTips,
        };
    }
    static async addTripStop(userId, tripId, input) {
        // Check trip ownership
        const trip = await db_js_1.prisma.trip.findUnique({
            where: { id: tripId },
            include: { stops: true },
        });
        if (!trip)
            throw new AppError_js_1.AppError('Trip not found', 404);
        if (trip.userId !== userId)
            throw new AppError_js_1.AppError('Forbidden: Unauthorized trip modification', 403);
        let cityName = input.city || input.destinationName;
        let countryName = input.country;
        if (input.destinationId) {
            const dest = await db_js_1.prisma.destination.findUnique({ where: { id: input.destinationId } });
            if (dest) {
                cityName = dest.name;
                countryName = dest.country;
            }
        }
        if (!cityName) {
            throw new AppError_js_1.AppError('City or destination name is required', 400);
        }
        const maxOrder = trip.stops.reduce((max, s) => (s.orderIndex > max ? s.orderIndex : max), -1);
        const orderIndex = maxOrder + 1;
        const arrivalDate = input.arrivalDate ? new Date(input.arrivalDate) : trip.startDate;
        const departureDate = input.departureDate ? new Date(input.departureDate) : trip.endDate;
        const stop = await db_js_1.prisma.tripStop.create({
            data: {
                tripId,
                destinationName: `${cityName} Stop`,
                city: cityName,
                country: countryName || 'Global',
                arrivalDate,
                departureDate,
                orderIndex,
            },
        });
        return stop;
    }
    static async removeTripStop(userId, tripId, stopId) {
        const trip = await db_js_1.prisma.trip.findUnique({ where: { id: tripId } });
        if (!trip)
            throw new AppError_js_1.AppError('Trip not found', 404);
        if (trip.userId !== userId)
            throw new AppError_js_1.AppError('Forbidden: Unauthorized trip modification', 403);
        const stop = await db_js_1.prisma.tripStop.findUnique({ where: { id: stopId } });
        if (!stop || stop.tripId !== tripId)
            throw new AppError_js_1.AppError('Trip stop not found', 404);
        await db_js_1.prisma.tripStop.delete({ where: { id: stopId } });
    }
    static async reorderTripStops(userId, tripId, stopIds) {
        const trip = await db_js_1.prisma.trip.findUnique({ where: { id: tripId } });
        if (!trip)
            throw new AppError_js_1.AppError('Trip not found', 404);
        if (trip.userId !== userId)
            throw new AppError_js_1.AppError('Forbidden: Unauthorized trip modification', 403);
        const updatePromises = stopIds.map((id, index) => db_js_1.prisma.tripStop.updateMany({
            where: { id, tripId },
            data: { orderIndex: index },
        }));
        await Promise.all(updatePromises);
        const updatedStops = await db_js_1.prisma.tripStop.findMany({
            where: { tripId },
            orderBy: { orderIndex: 'asc' },
        });
        return updatedStops;
    }
}
exports.DestinationService = DestinationService;
