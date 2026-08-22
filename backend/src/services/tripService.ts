import { prisma } from '../config/db.js';
import { TripStatus, Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError.js';

export interface CreateTripInput {
  name: string;
  description?: string;
  startDate: string | Date;
  endDate: string | Date;
  coverImageUrl?: string;
  destinationCity?: string;
  destinationCountry?: string;
  totalBudget?: number;
  isPublic?: boolean;
}

export interface UpdateTripInput {
  name?: string;
  description?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  coverImageUrl?: string;
  status?: TripStatus;
  isPublic?: boolean;
  totalBudget?: number;
}

export interface ListTripsQuery {
  search?: string;
  status?: TripStatus;
  sortBy?: 'startDate' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export class TripService {
  private static calculateTripStatus(startDate: Date, endDate: Date): TripStatus {
    const now = new Date();
    if (now < startDate) return TripStatus.UPCOMING;
    if (now > endDate) return TripStatus.COMPLETED;
    return TripStatus.ONGOING;
  }

  static async createTrip(userId: string, input: CreateTripInput) {
    const start = new Date(input.startDate);
    const end = new Date(input.endDate);

    if (end < start) {
      throw new AppError('End date cannot be earlier than start date', 400);
    }

    const status = this.calculateTripStatus(start, end);
    const defaultCover =
      input.coverImageUrl ||
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80';

    const city = input.destinationCity || 'Goa';
    const country = input.destinationCountry || 'India';

    const trip = await prisma.trip.create({
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

  static async getTripById(userId: string, tripId: string) {
    const trip = await prisma.trip.findUnique({
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

    if (!trip) throw new AppError('Trip not found', 404);

    if (trip.userId !== userId && !trip.isPublic) {
      throw new AppError('Forbidden: You do not have access to this private trip', 403);
    }

    return trip;
  }

  static async listUserTrips(userId: string, query: ListTripsQuery = {}) {
    const { search, status, sortBy = 'startDate', sortOrder = 'asc' } = query;

    const where: Prisma.TripWhereInput = {
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

    const trips = await prisma.trip.findMany({
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

  static async updateTrip(userId: string, tripId: string, input: UpdateTripInput) {
    const existing = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!existing) throw new AppError('Trip not found', 404);
    if (existing.userId !== userId) throw new AppError('Forbidden: Unauthorized to update trip', 403);

    const start = input.startDate ? new Date(input.startDate) : existing.startDate;
    const end = input.endDate ? new Date(input.endDate) : existing.endDate;

    if (end < start) {
      throw new AppError('End date cannot be earlier than start date', 400);
    }

    const calculatedStatus = input.status || this.calculateTripStatus(start, end);

    const updated = await prisma.trip.update({
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
      await prisma.budget.upsert({
        where: { tripId },
        update: { totalBudget: input.totalBudget },
        create: { tripId, totalBudget: input.totalBudget },
      });
    }

    return updated;
  }

  static async deleteTrip(userId: string, tripId: string) {
    const existing = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!existing) throw new AppError('Trip not found', 404);
    if (existing.userId !== userId) throw new AppError('Forbidden: Unauthorized to delete trip', 403);

    await prisma.trip.delete({
      where: { id: tripId },
    });
  }
}
