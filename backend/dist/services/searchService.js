"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const db_js_1 = require("../config/db.js");
class SearchService {
    static async globalSearch(query, userId) {
        if (!query || !query.trim()) {
            return { trips: [], destinations: [], activities: [], posts: [] };
        }
        const q = query.trim();
        const [trips, destinations, activities, posts] = await Promise.all([
            db_js_1.prisma.trip.findMany({
                where: {
                    AND: [
                        userId ? { OR: [{ userId }, { isPublic: true }] } : { isPublic: true },
                        {
                            OR: [
                                { name: { contains: q, mode: 'insensitive' } },
                                { description: { contains: q, mode: 'insensitive' } },
                            ],
                        },
                    ],
                },
                take: 5,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    startDate: true,
                    endDate: true,
                    coverImageUrl: true,
                    isPublic: true,
                },
            }),
            db_js_1.prisma.destination.findMany({
                where: {
                    OR: [
                        { name: { contains: q, mode: 'insensitive' } },
                        { country: { contains: q, mode: 'insensitive' } },
                        { region: { contains: q, mode: 'insensitive' } },
                        { tags: { hasSome: [q] } },
                    ],
                },
                take: 5,
                select: {
                    id: true,
                    name: true,
                    country: true,
                    region: true,
                    imageUrl: true,
                    rating: true,
                },
            }),
            db_js_1.prisma.activity.findMany({
                where: {
                    OR: [
                        { name: { contains: q, mode: 'insensitive' } },
                        { locationName: { contains: q, mode: 'insensitive' } },
                        { description: { contains: q, mode: 'insensitive' } },
                    ],
                },
                take: 5,
                include: {
                    category: true,
                },
            }),
            db_js_1.prisma.communityPost.findMany({
                where: {
                    isPublished: true,
                    OR: [
                        { title: { contains: q, mode: 'insensitive' } },
                        { content: { contains: q, mode: 'insensitive' } },
                    ],
                },
                take: 5,
                include: {
                    user: { select: { id: true, name: true, avatarUrl: true } },
                    trip: { select: { id: true, name: true, coverImageUrl: true } },
                },
            }),
        ]);
        return {
            trips,
            destinations,
            activities,
            posts,
            totalCount: trips.length + destinations.length + activities.length + posts.length,
        };
    }
}
exports.SearchService = SearchService;
