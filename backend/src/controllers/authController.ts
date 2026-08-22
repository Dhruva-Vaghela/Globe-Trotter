import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import { AppError } from '../utils/AppError.js';
import { sendResponse } from '../utils/ApiResponse.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { AuthService } from '../services/authService.js';
import { UserService } from '../services/userService.js';

import { UploadService } from '../services/uploadService.js';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    avatarUrl: z.string().optional(),
    profileImage: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: z.string().min(6, 'New password must be at least 6 characters'),
  }),
});

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, avatarUrl, profileImage } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    let finalAvatarUrl = avatarUrl || null;

    // If base64 profile image is provided during signup, upload directly to Cloudinary
    if (profileImage) {
      try {
        const uploadRes = await UploadService.uploadImage({
          base64Data: profileImage,
          folder: 'globetrotter_avatars',
        });
        if (uploadRes && uploadRes.imageUrl) {
          finalAvatarUrl = uploadRes.imageUrl;
        } else {
          finalAvatarUrl = profileImage;
        }
      } catch (uploadErr) {
        console.error('Cloudinary upload fallback to direct image string:', uploadErr);
        finalAvatarUrl = profileImage;
      }
    }

    const passwordHash = await AuthService.hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        avatarUrl: finalAvatarUrl,
        preference: {
          create: {
            defaultCurrency: 'USD',
            preferredLanguage: 'en',
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    const token = AuthService.generateToken(user.id, user.email, user.role);
    return sendResponse(res, 201, 'User registered successfully', { token, user });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await AuthService.verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = AuthService.generateToken(user.id, user.email, user.role);
    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };

    return sendResponse(res, 200, 'Login successful', { token, user: userProfile });
  } catch (err) {
    next(err);
  }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const user = await UserService.getUserProfile(req.user.userId);
    return sendResponse(res, 200, 'User profile retrieved', user);
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    const token = await AuthService.generatePasswordResetToken(email);
    // In production, this sends an email with the link. Here we return the token for testing/demo.
    return sendResponse(res, 200, 'Password reset token generated', { token });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, password } = req.body;
    await AuthService.resetPassword(token, password);
    return sendResponse(res, 200, 'Password has been reset successfully');
  } catch (err) {
    next(err);
  }
}
