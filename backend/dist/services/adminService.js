"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const db_js_1 = require("../config/db.js");
const AppError_js_1 = require("../utils/AppError.js");
const client_1 = require("@prisma/client");
class AdminService {
    static async getDashboardAnalytics() {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const [totalUsers, newUsersLast30Days, adminUsers, totalTrips, upcomingTrips, ongoingTrips, completedTrips, publicTrips, totalDestinations, destinationsCostAvg, totalActivities, totalPosts, totalSections, totalExpenses,] = await Promise.all([
            db_js_1.prisma.user.count(),
            db_js_1.prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
            db_js_1.prisma.user.count({ where: { role: client_1.Role.ADMIN } }),
            db_js_1.prisma.trip.count(),
            db_js_1.prisma.trip.count({ where: { status: 'UPCOMING' } }),
            db_js_1.prisma.trip.count({ where: { status: 'ONGOING' } }),
            db_js_1.prisma.trip.count({ where: { status: 'COMPLETED' } }),
            db_js_1.prisma.trip.count({ where: { isPublic: true } }),
            db_js_1.prisma.destination.count(),
            db_js_1.prisma.destination.aggregate({ _avg: { estimatedDailyCost: true } }),
            db_js_1.prisma.activity.count(),
            db_js_1.prisma.communityPost.count(),
            db_js_1.prisma.itinerarySection.count(),
            db_js_1.prisma.expense.count(),
        ]);
        return {
            users: {
                total: totalUsers,
                newLast30Days: newUsersLast30Days,
                admins: adminUsers,
                standardUsers: totalUsers - adminUsers,
            },
            trips: {
                total: totalTrips,
                upcoming: upcomingTrips,
                ongoing: ongoingTrips,
                completed: completedTrips,
                publicShared: publicTrips,
            },
            destinations: {
                total: totalDestinations,
                avgDailyCost: Math.round((destinationsCostAvg._avg.estimatedDailyCost || 0) * 100) / 100,
            },
            activities: {
                total: totalActivities,
            },
            engagement: {
                totalPosts,
                totalSectionsCreated: totalSections,
                totalExpensesLogged: totalExpenses,
            },
        };
    }
    static async getPopularItems(limit = 5) {
        const popularDestinations = await db_js_1.prisma.destination.findMany({
            take: limit,
            orderBy: [{ rating: 'desc' }, { name: 'asc' }],
        });
        const popularActivities = await db_js_1.prisma.activity.findMany({
            take: limit,
            orderBy: [{ rating: 'desc' }, { name: 'asc' }],
            include: {
                category: true,
            },
        });
        return {
            popularDestinations,
            popularActivities,
        };
    }
    static async listUsers(query) {
        const { search, role, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 20, } = query;
        const skip = (page - 1) * limit;
        const whereCondition = {};
        if (role) {
            whereCondition.role = role;
        }
        if (search && search.trim()) {
            const q = search.trim();
            whereCondition.OR = [
                { name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
            ];
        }
        const [total, users] = await Promise.all([
            db_js_1.prisma.user.count({ where: whereCondition }),
            db_js_1.prisma.user.findMany({
                where: whereCondition,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    avatarUrl: true,
                    bio: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: { trips: true, posts: true },
                    },
                },
            }),
        ]);
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            users,
        };
    }
    static async updateUserRole(adminUserId, targetUserId, newRole) {
        if (adminUserId === targetUserId) {
            throw new AppError_js_1.AppError('Admins cannot modify their own account role', 400);
        }
        const targetUser = await db_js_1.prisma.user.findUnique({ where: { id: targetUserId } });
        if (!targetUser) {
            throw new AppError_js_1.AppError('User not found', 404);
        }
        return await db_js_1.prisma.user.update({
            where: { id: targetUserId },
            data: { role: newRole },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                updatedAt: true,
            },
        });
    }
    static async deleteUser(adminUserId, targetUserId) {
        if (adminUserId === targetUserId) {
            throw new AppError_js_1.AppError('Admins cannot delete their own account', 400);
        }
        const targetUser = await db_js_1.prisma.user.findUnique({ where: { id: targetUserId } });
        if (!targetUser) {
            throw new AppError_js_1.AppError('User not found', 404);
        }
        await db_js_1.prisma.user.delete({ where: { id: targetUserId } });
        return { success: true, message: `User ${targetUser.name} (${targetUser.email}) has been deleted` };
    }
}
exports.AdminService = AdminService;
