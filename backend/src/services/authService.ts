import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { ENV } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(userId: string, email: string, role: string): string {
    const options: SignOptions = { expiresIn: '7d' };
    return jwt.sign({ sub: userId, email, role }, ENV.JWT_SECRET, options);
  }

  static async generatePasswordResetToken(email: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('No account found with this email address', 404);
    }
    const options: SignOptions = { expiresIn: '1h' };
    return jwt.sign({ sub: user.id, purpose: 'reset-password' }, ENV.JWT_SECRET, options);
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
    let decoded: any;
    try {
      decoded = jwt.verify(token, ENV.JWT_SECRET);
    } catch (err) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    if (decoded.purpose !== 'reset-password') {
      throw new AppError('Invalid token purpose', 400);
    }

    const passwordHash = await this.hashPassword(newPassword);
    await prisma.user.update({
      where: { id: decoded.sub },
      data: { passwordHash },
    });
  }
}
