"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarService = void 0;
const db_js_1 = require("../config/db.js");
const AppError_js_1 = require("../utils/AppError.js");
class CalendarService {
    static async getCalendarOverview(userId, startQuery, endQuery) {
        const trips = await db_js_1.prisma.trip.findMany({
            where: { userId },
            include: {
                stops: { orderBy: { orderIndex: 'asc' } },
                sections: {
                    orderBy: { orderIndex: 'asc' },
                    include: { items: { orderBy: { orderIndex: 'asc' } } },
                },
            },
            orderBy: { startDate: 'asc' },
        });
        const events = [];
        for (const trip of trips) {
            // 1. Trip event
            events.push({
                id: `trip-${trip.id}`,
                tripId: trip.id,
                title: trip.name,
                type: 'TRIP',
                start: trip.startDate,
                end: trip.endDate,
                status: trip.status,
                coverImageUrl: trip.coverImageUrl || undefined,
                location: trip.stops[0]?.city ? `${trip.stops[0].city}, ${trip.stops[0].country}` : undefined,
            });
            // 2. Stop events
            for (const stop of trip.stops) {
                events.push({
                    id: `stop-${stop.id}`,
                    tripId: trip.id,
                    title: `Stop: ${stop.destinationName || stop.city}`,
                    type: 'STOP',
                    start: stop.arrivalDate,
                    end: stop.departureDate,
                    location: `${stop.city}, ${stop.country}`,
                });
            }
            // 3. Section & Activity events
            for (const sec of trip.sections) {
                events.push({
                    id: `sec-${sec.id}`,
                    tripId: trip.id,
                    title: sec.title,
                    type: 'SECTION',
                    start: sec.startDate,
                    end: sec.endDate,
                    cost: sec.sectionBudget,
                });
                for (const item of sec.items) {
                    events.push({
                        id: `item-${item.id}`,
                        tripId: trip.id,
                        title: item.title,
                        type: 'ACTIVITY',
                        start: item.date,
                        startTime: item.startTime || '09:00',
                        cost: item.cost,
                    });
                }
            }
        }
        return {
            tripsCount: trips.length,
            totalEventsCount: events.length,
            events,
        };
    }
    static async getTripCalendarData(userId, tripId) {
        const trip = await db_js_1.prisma.trip.findUnique({
            where: { id: tripId },
            include: {
                stops: true,
                sections: { include: { items: true } },
            },
        });
        if (!trip)
            throw new AppError_js_1.AppError('Trip not found', 404);
        if (trip.userId !== userId)
            throw new AppError_js_1.AppError('Forbidden: Unauthorized to access trip calendar', 403);
        return this.getCalendarOverview(userId);
    }
}
exports.CalendarService = CalendarService;
