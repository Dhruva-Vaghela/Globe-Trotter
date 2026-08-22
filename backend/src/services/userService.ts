import { prisma } from '../config/db.js';
import { AppError } from '../utils/AppError.js';

export interface UpdateProfileInput {
  name?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface UpdatePreferencesInput {
  defaultCurrency?: string;
  preferredLanguage?: string;
  travelStyle?: string;
}

export class UserService {
  static async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        preference: true,
      },
    });
    if (!user) throw new AppError('User profile not found', 404);
    return user;
  }

  static async updateProfile(userId: string, data: UpdateProfileInput) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
        ...(data.bio !== undefined && { bio: data.bio }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
      },
    });
    return user;
  }

  static async updatePreferences(userId: string, data: UpdatePreferencesInput) {
    const preference = await prisma.userPreference.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        defaultCurrency: data.defaultCurrency || 'USD',
        preferredLanguage: data.preferredLanguage || 'en',
        travelStyle: data.travelStyle,
      },
    });
    return preference;
  }

  static async deleteAccount(userId: string) {
    await prisma.user.delete({
      where: { id: userId },
    });
  }
}
