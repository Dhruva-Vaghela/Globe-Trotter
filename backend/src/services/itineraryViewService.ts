import { prisma } from '../config/db.js';
import { AppError } from '../utils/AppError.js';

export interface TimelineEvent {
  id: string;
  type: 'ARRIVAL' | 'ACTIVITY' | 'MEAL' | 'CUSTOM';
  title: string;
  date: string;
  time: string;
  cost: number;
  notes?: string | null;
  location?: string | null;
  category?: string | null;
}

export class ItineraryViewService {
  private static async getTripAndVerifyOwner(userId: string, tripId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        stops: { orderBy: { orderIndex: 'asc' } },
        budget: true,
      },
    });
    if (!trip) {
      throw new AppError('Trip not found', 404);
    }
    if (trip.userId !== userId) {
      throw new AppError('Forbidden: You do not own this trip', 403);
    }
    return trip;
  }

  static async getDayWiseView(userId: string, tripId: string) {
    const trip = await this.getTripAndVerifyOwner(userId, tripId);

    const sections = await prisma.itinerarySection.findMany({
      where: { tripId },
      orderBy: { orderIndex: 'asc' },
      include: {
        items: {
          orderBy: { orderIndex: 'asc' },
          include: {
            activity: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    const daySections = sections.map((sec) => {
      const sectionCost = sec.items.reduce((acc, item) => acc + (item.cost || 0), 0);
      return {
        ...sec,
        totalItemCost: sectionCost,
      };
    });

    const totalTripCost = daySections.reduce((acc, sec) => acc + sec.totalItemCost, 0);

    return {
      trip: {
        id: trip.id,
        name: trip.name,
        description: trip.description,
        startDate: trip.startDate,
        endDate: trip.endDate,
        coverImageUrl: trip.coverImageUrl,
        stops: trip.stops,
        totalBudget: trip.budget?.totalBudget || 0,
      },
      sections: daySections,
      summary: {
        totalTripCost,
        totalSections: daySections.length,
      },
    };
  }

  static async getTimelineView(userId: string, tripId: string) {
    const trip = await this.getTripAndVerifyOwner(userId, tripId);

    const sections = await prisma.itinerarySection.findMany({
      where: { tripId },
      include: {
        items: {
          include: {
            activity: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    const events: TimelineEvent[] = [];

    // Add Destination Stop Arrival Events
    trip.stops.forEach((stop) => {
      events.push({
        id: `stop-${stop.id}`,
        type: 'ARRIVAL',
        title: `Arrival at ${stop.city}, ${stop.country}`,
        date: stop.arrivalDate.toISOString().split('T')[0],
        time: '08:00 AM',
        cost: 0,
        notes: `Destination stop: ${stop.destinationName}`,
        location: `${stop.city}, ${stop.country}`,
        category: 'Transport',
      });
    });

    // Add Itinerary Item Events
    sections.forEach((sec) => {
      sec.items.forEach((item) => {
        const itemDateStr = item.date ? item.date.toISOString().split('T')[0] : sec.startDate.toISOString().split('T')[0];
        let eventType: TimelineEvent['type'] = 'ACTIVITY';
        if (item.title.toLowerCase().includes('meal') || item.title.toLowerCase().includes('dinner') || item.title.toLowerCase().includes('lunch') || item.title.toLowerCase().includes('breakfast')) {
          eventType = 'MEAL';
        }

        events.push({
          id: item.id,
          type: eventType,
          title: item.title,
          date: itemDateStr,
          time: item.startTime || '09:00 AM',
          cost: item.cost,
          notes: item.notes,
          location: item.activity?.locationName || null,
          category: item.activity?.category?.name || 'General',
        });
      });
    });

    // Sort events chronologically by Date and Time
    events.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return (a.time || '').localeCompare(b.time || '');
    });

    return {
      tripId,
      tripName: trip.name,
      events,
    };
  }

  static async getSummaryView(userId: string, tripId: string) {
    const trip = await this.getTripAndVerifyOwner(userId, tripId);

    const sections = await prisma.itinerarySection.findMany({
      where: { tripId },
      include: {
        items: true,
      },
    });

    // Duration calculation
    const startMs = new Date(trip.startDate).getTime();
    const endMs = new Date(trip.endDate).getTime();
    const totalDurationDays = Math.max(1, Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1);

    // Items and costs
    let totalActivitiesCount = 0;
    let totalSpent = 0;
    const dateCostMap: Record<string, number> = {};

    sections.forEach((sec) => {
      sec.items.forEach((item) => {
        totalActivitiesCount++;
        totalSpent += item.cost || 0;

        const dateStr = item.date ? item.date.toISOString().split('T')[0] : sec.startDate.toISOString().split('T')[0];
        dateCostMap[dateStr] = (dateCostMap[dateStr] || 0) + (item.cost || 0);
      });
    });

    const costPerDay = Object.keys(dateCostMap).map((date) => ({
      date,
      cost: dateCostMap[date],
    }));

    const destinationSequence = trip.stops.map((s) => `${s.city}, ${s.country}`);

    return {
      tripId,
      tripName: trip.name,
      totalDurationDays,
      totalActivitiesCount,
      totalBudget: trip.budget?.totalBudget || sections.reduce((sum, s) => sum + s.sectionBudget, 0),
      totalSpent,
      destinationSequence,
      costPerDay,
    };
  }
}
