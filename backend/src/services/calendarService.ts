import { prisma } from '../config/db.js';
import { AppError } from '../utils/AppError.js';

export interface CalendarEvent {
  id: string;
  tripId: string;
  title: string;
  type: 'TRIP' | 'STOP' | 'SECTION' | 'ACTIVITY';
  start: Date;
  end?: Date;
  startTime?: string;
  cost?: number;
  location?: string;
  status?: string;
  coverImageUrl?: string;
}

export class CalendarService {
  static async getCalendarOverview(userId: string, startQuery?: string, endQuery?: string) {
    const trips = await prisma.trip.findMany({
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

    const events: CalendarEvent[] = [];

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

  static async getTripCalendarData(userId: string, tripId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        stops: true,
        sections: { include: { items: true } },
      },
    });

    if (!trip) throw new AppError('Trip not found', 404);
    if (trip.userId !== userId) throw new AppError('Forbidden: Unauthorized to access trip calendar', 403);

    return this.getCalendarOverview(userId);
  }
}
