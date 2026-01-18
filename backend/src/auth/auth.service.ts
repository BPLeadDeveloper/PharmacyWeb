import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async googleLogin(googleUser: any) {
    // Check if user exists
    let user = await this.prisma.users.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      // Create new user if doesn't exist
      user = await this.prisma.users.create({
        data: {
          email: googleUser.email,
          phone: `google_${Date.now()}`, // Placeholder since phone is required
          password_hash: '', // Empty for OAuth users
          first_name: googleUser.firstName,
          last_name: googleUser.lastName,
          is_email_verified: true, // Google emails are verified
        },
      });
    }

    // Update last login
    await this.prisma.users.update({
      where: { user_id: user.user_id },
      data: { last_login_at: new Date() },
    });

    // Generate JWT
    const token = this.generateToken(user.user_id, user.email);

    return {
      user: {
        user_id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      access_token: token,
    };
  }

  async validateUser(userId: bigint) {
    const user = await this.prisma.users.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        email: true,
        phone: true,
        first_name: true,
        last_name: true,
        is_active: true,
      },
    });

    if (!user || !user.is_active) {
      return null;
    }

    return user;
  }

  private generateToken(userId: bigint, email: string): string {
    const payload = { sub: userId.toString(), email };
    return this.jwtService.sign(payload);
  }
}