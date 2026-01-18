import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.prisma.users.findFirst({
      where: {
        OR: [
          { email: registerDto.email },
          { phone: registerDto.phone }
        ]
      }
    });

    if (existingUser) {
      throw new ConflictException('User with this email or phone already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = await this.prisma.users.create({
      data: {
        email: registerDto.email,
        phone: registerDto.phone,
        password_hash: hashedPassword,
        first_name: registerDto.first_name,
        last_name: registerDto.last_name,
        date_of_birth: registerDto.date_of_birth ? new Date(registerDto.date_of_birth) : null,
      },
      select: {
        user_id: true,
        email: true,
        phone: true,
        first_name: true,
        last_name: true,
        is_active: true,
      }
    });

    // Generate JWT token
    const token = this.generateToken(user.user_id, user.email);

    return {
      user,
      access_token: token,
    };
  }

  async login(loginDto: LoginDto) {
    // Find user
    const user = await this.prisma.users.findUnique({
      where: { email: loginDto.email }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user registered with Google (no password)
    if (!user.password_hash) {
      throw new UnauthorizedException('This account uses Google sign-in. Please login with Google.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Update last login
    await this.prisma.users.update({
      where: { user_id: user.user_id },
      data: { last_login_at: new Date() }
    });

    // Generate JWT token
    const token = this.generateToken(user.user_id, user.email);

    return {
      user: {
        user_id: user.user_id,
        email: user.email,
        phone: user.phone,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      access_token: token,
    };
  }

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