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

    // Create user and customer profile in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.users.create({
        data: {
          email: registerDto.email,
          phone: registerDto.phone,
          password_hash: hashedPassword,
          first_name: registerDto.first_name,
          last_name: registerDto.last_name,
          date_of_birth: registerDto.date_of_birth ? new Date(registerDto.date_of_birth) : null,
        },
      });

      // Create customer profile
      await tx.customers.create({
        data: {
          user_id: user.user_id,
        },
      });

      // Get or create CUSTOMER role
      let customerRole = await tx.user_roles.findUnique({
        where: { role_name: 'CUSTOMER' },
      });

      if (!customerRole) {
        customerRole = await tx.user_roles.create({
          data: {
            role_name: 'CUSTOMER',
            description: 'Customer role for ordering medicines',
          },
        });
      }

      // Assign CUSTOMER role to user
      await tx.user_role_assignments.create({
        data: {
          user_id: user.user_id,
          role_id: customerRole.role_id,
        },
      });

      return user;
    });

    // Generate JWT token
    const token = await this.generateToken(result.user_id, result.email);

    return {
      user: {
        user_id: result.user_id,
        email: result.email,
        phone: result.phone,
        first_name: result.first_name,
        last_name: result.last_name,
        is_active: result.is_active,
      },
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
    const token = await this.generateToken(user.user_id, user.email);

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
      // Create new user with customer profile in transaction
      user = await this.prisma.$transaction(async (tx) => {
        const newUser = await tx.users.create({
          data: {
            email: googleUser.email,
            phone: `google_${Date.now()}`, // Placeholder since phone is required
            password_hash: '', // Empty for OAuth users
            first_name: googleUser.firstName,
            last_name: googleUser.lastName,
            is_email_verified: true, // Google emails are verified
          },
        });

        // Create customer profile
        await tx.customers.create({
          data: {
            user_id: newUser.user_id,
          },
        });

        // Get or create CUSTOMER role
        let customerRole = await tx.user_roles.findUnique({
          where: { role_name: 'CUSTOMER' },
        });

        if (!customerRole) {
          customerRole = await tx.user_roles.create({
            data: {
              role_name: 'CUSTOMER',
              description: 'Customer role for ordering medicines',
            },
          });
        }

        // Assign CUSTOMER role
        await tx.user_role_assignments.create({
          data: {
            user_id: newUser.user_id,
            role_id: customerRole.role_id,
          },
        });

        return newUser;
      });
    }

    // Update last login
    await this.prisma.users.update({
      where: { user_id: user.user_id },
      data: { last_login_at: new Date() },
    });

    // Generate JWT
    const token = await this.generateToken(user.user_id, user.email);

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
      include: {
        user_role_assignments_user_role_assignments_user_idTousers: {
          include: {
            user_roles: true,
          },
        },
      },
    });

    if (!user || !user.is_active) {
      return null;
    }

    // Extract roles
    const roles = user.user_role_assignments_user_role_assignments_user_idTousers.map(
      (assignment) => assignment.user_roles.role_name
    );

    return {
      user_id: user.user_id,
      email: user.email,
      phone: user.phone,
      first_name: user.first_name,
      last_name: user.last_name,
      is_active: user.is_active,
      roles,
    };
  }

  private async generateToken(userId: bigint, email: string): Promise<string> {
    // Fetch user roles
    const userRoles = await this.prisma.user_role_assignments.findMany({
      where: { user_id: userId },
      include: {
        user_roles: true,
      },
    });

    const roles = userRoles.map((ur) => ur.user_roles.role_name);
    const role_ids = userRoles.map((ur) => ur.user_roles.role_id.toString());

    const payload = {
      sub: userId.toString(),
      email,
      roles,
      role_ids,
    };
    
    return this.jwtService.sign(payload);
  }
}