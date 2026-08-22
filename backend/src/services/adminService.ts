import { prisma } from '../config/db.js';
import { AppError } from '../utils/AppError.js';
import { Role } from '@prisma/client';

export interface UserListQuery {
  search?: string;
  role?: Role;
  sortBy?: 'createdAt' | 'name' | 'email';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export class AdminService {
  static async getDashboardAnalytics() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsersLast30Days,
      adminUsers,
      totalTrips,
      upcomingTrips,
      ongoingTrips,
      completedTrips,
      publicTrips,
      totalDestinations,
      destinationsCostAvg,
      totalActivities,
      totalPosts,
      totalSections,
      totalExpenses,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.user.count({ where: { role: Role.ADMIN } }),
      prisma.trip.count(),
      prisma.trip.count({ where: { status: 'UPCOMING' } }),
      prisma.trip.count({ where: { status: 'ONGOING' } }),
      prisma.trip.count({ where: { status: 'COMPLETED' } }),
      prisma.trip.count({ where: { isPublic: true } }),
      prisma.destination.count(),
      prisma.destination.aggregate({ _avg: { estimatedDailyCost: true } }),
      prisma.activity.count(),
      prisma.communityPost.count(),
      prisma.itinerarySection.count(),
      prisma.expense.count(),
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
    const popularDestinations = await prisma.destination.findMany({
      take: limit,
      orderBy: [{ rating: 'desc' }, { name: 'asc' }],
    });

    const popularActivities = await prisma.activity.findMany({
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

  static async listUsers(query: UserListQuery) {
    const {
      search,
      role,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = query;

    const skip = (page - 1) * limit;

    const whereCondition: any = {};
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
      prisma.user.count({ where: whereCondition }),
      prisma.user.findMany({
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

  static async updateUserRole(adminUserId: string, targetUserId: string, newRole: Role) {
    if (adminUserId === targetUserId) {
      throw new AppError('Admins cannot modify their own account role', 400);
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      throw new AppError('User not found', 404);
    }

    return await prisma.user.update({
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

  static async deleteUser(adminUserId: string, targetUserId: string) {
    if (adminUserId === targetUserId) {
      throw new AppError('Admins cannot delete their own account', 400);
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      throw new AppError('User not found', 404);
    }

    await prisma.user.delete({ where: { id: targetUserId } });

    return { success: true, message: `User ${targetUser.name} (${targetUser.email}) has been deleted` };
  }
}
