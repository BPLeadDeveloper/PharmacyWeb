import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterAdminDto, RegisterCustomerDto, RegisterPharmacistDto, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';

export type UserType = 'CUSTOMER' | 'PHARMACIST' | 'ADMIN';

export interface AuthUser {
  id: bigint;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  user_type: UserType;
  pharmacist_role?: string;
  admin_level?: string;
  is_active: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }


  async registerCustomer(registerDto: RegisterCustomerDto) {

    const existingCustomer = await this.prisma.customers.findFirst({
      where: {
        OR: [
          { email: registerDto.email },
          { phone: registerDto.phone }
        ]
      }
    });

    if (existingCustomer) {
      throw new ConflictException('Customer with this email or phone already exists');
    }


    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const customer = await this.prisma.customers.create({
      data: {
        email: registerDto.email,
        phone: registerDto.phone,
        password_hash: hashedPassword,
        first_name: registerDto.first_name,
        last_name: registerDto.last_name,
        date_of_birth: registerDto.date_of_birth ? new Date(registerDto.date_of_birth) : null,
        emergency_contact_name: registerDto.emergency_contact_name,
        emergency_contact_phone: registerDto.emergency_contact_phone,
      },
    });

    const token = this.generateToken({
      id: customer.customer_id,
      email: customer.email,
      phone: customer.phone,
      first_name: customer.first_name,
      last_name: customer.last_name,
      user_type: 'CUSTOMER',
      is_active: customer.is_active,
    });

    return {
      user: {
        id: customer.customer_id.toString(),
        email: customer.email,
        phone: customer.phone,
        first_name: customer.first_name,
        last_name: customer.last_name,
        user_type: 'CUSTOMER' as UserType,
        is_active: customer.is_active,
      },
      token,
    };
  }

  async registerPharmacist(registerDto: RegisterPharmacistDto, createdByAdminId?: bigint) {

    const existingPharmacist = await this.prisma.pharmacists.findFirst({
      where: {
        OR: [
          { email: registerDto.email },
          { phone: registerDto.phone }
        ]
      }
    });

    if (existingPharmacist) {
      throw new ConflictException('Pharmacist with this email or phone already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const pharmacist = await this.prisma.pharmacists.create({
      data: {
        email: registerDto.email,
        phone: registerDto.phone,
        password_hash: hashedPassword,
        first_name: registerDto.first_name,
        last_name: registerDto.last_name,
        date_of_birth: registerDto.date_of_birth ? new Date(registerDto.date_of_birth) : null,
        pharmacist_role: registerDto.pharmacist_role,
        pharmacist_license_number: registerDto.pharmacist_license_number,
        license_state: registerDto.license_state,
        license_expiry_date: new Date(registerDto.license_expiry_date),
        assigned_by: createdByAdminId,
      },
    });

    const token = this.generateToken({
      id: pharmacist.pharmacist_id,
      email: pharmacist.email,
      phone: pharmacist.phone,
      first_name: pharmacist.first_name,
      last_name: pharmacist.last_name,
      user_type: 'PHARMACIST',
      pharmacist_role: pharmacist.pharmacist_role,
      is_active: pharmacist.is_active,
    });

    return {
      user: {
        id: pharmacist.pharmacist_id.toString(),
        email: pharmacist.email,
        phone: pharmacist.phone,
        first_name: pharmacist.first_name,
        last_name: pharmacist.last_name,
        user_type: 'PHARMACIST' as UserType,
        pharmacist_role: pharmacist.pharmacist_role,
        is_active: pharmacist.is_active,
      },
      token,
    };
  }

  async registerAdmin(registerDto: RegisterAdminDto) {

    const existingAdmin = await this.prisma.admins.findFirst({
      where: {
        OR: [
          { email: registerDto.email },
          { phone: registerDto.phone }
        ]
      }
    });

    if (existingAdmin) {
      throw new ConflictException('Admin with this email or phone already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const admin = await this.prisma.admins.create({
      data: {
        email: registerDto.email,
        phone: registerDto.phone,
        password_hash: hashedPassword,
        first_name: registerDto.first_name,
        last_name: registerDto.last_name,
        admin_level: registerDto.admin_level || 'STANDARD',
      },
    });

    const token = this.generateToken({
      id: admin.admin_id,
      email: admin.email,
      phone: admin.phone,
      first_name: admin.first_name,
      last_name: admin.last_name,
      user_type: 'ADMIN',
      is_active: admin.is_active,
    });

    return {
      user: {
        id: admin.admin_id.toString(),
        email: admin.email,
        phone: admin.phone,
        first_name: admin.first_name,
        last_name: admin.last_name,
        user_type: 'ADMIN' as UserType,
        admin_level: admin.admin_level,
        is_active: admin.is_active,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    let user: any = null;
    let userType: UserType | null = null;
    let userId: bigint | null = null;
    let additionalData: any = {};

    // Check customers
    const customer = await this.prisma.customers.findUnique({
      where: { email: loginDto.email },
    });

    if (customer) {
      user = customer;
      userType = 'CUSTOMER';
      userId = customer.customer_id;
    }

    // Check pharmacists
    if (!user) {
      const pharmacist = await this.prisma.pharmacists.findUnique({
        where: { email: loginDto.email },
      });

      if (pharmacist) {
        user = pharmacist;
        userType = 'PHARMACIST';
        userId = pharmacist.pharmacist_id;
        additionalData.pharmacist_role = pharmacist.pharmacist_role;
      }
    }

    // Check admins
    if (!user) {
      const admin = await this.prisma.admins.findUnique({
        where: { email: loginDto.email },
      });

      if (admin) {
        user = admin;
        userType = 'ADMIN';
        userId = admin.admin_id;
        additionalData.admin_level = admin.admin_level;
      }
    }

    // Not found
    if (!user || !userType || !userId) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check active
    if (!user.is_active) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Update last login
    const updateData = { last_login_at: new Date() };

    if (userType === 'CUSTOMER') {
      await this.prisma.customers.update({
        where: { customer_id: userId },
        data: updateData,
      });
    } else if (userType === 'PHARMACIST') {
      await this.prisma.pharmacists.update({
        where: { pharmacist_id: userId },
        data: updateData,
      });
    } else {
      await this.prisma.admins.update({
        where: { admin_id: userId },
        data: updateData,
      });
    }

    const token = this.generateToken({
      id: userId,
      email: user.email,
      phone: user.phone,
      first_name: user.first_name,
      last_name: user.last_name,
      user_type: userType,
      is_active: user.is_active,
      ...additionalData,
    });

    return {
      user: {
        id: userId.toString(),
        email: user.email,
        phone: user.phone,
        first_name: user.first_name,
        last_name: user.last_name,
        user_type: userType,
        is_active: user.is_active,
        ...additionalData,
      },
      token,
    };
  }


  async validateUser(userId: bigint, userType: UserType): Promise<AuthUser | null> {
    let user: any = null;

    if (userType === 'CUSTOMER') {
      user = await this.prisma.customers.findUnique({
        where: { customer_id: userId },
      });
    } else if (userType === 'PHARMACIST') {
      user = await this.prisma.pharmacists.findUnique({
        where: { pharmacist_id: userId },
      });
    } else if (userType === 'ADMIN') {
      user = await this.prisma.admins.findUnique({
        where: { admin_id: userId },
      });
    }

    if (!user || !user.is_active) {
      return null;
    }

    return {
      id: userId,
      email: user.email,
      phone: user.phone,
      first_name: user.first_name,
      last_name: user.last_name,
      user_type: userType,
      pharmacist_role: user.pharmacist_role,
      admin_level: user.admin_level,
      is_active: user.is_active,
    };
  }

  private generateToken(user: AuthUser): string {
    const payload = {
      sub: user.id.toString(),
      email: user.email,
      user_type: user.user_type,
      pharmacist_role: user.pharmacist_role,
      admin_level: user.admin_level,
    };

    return this.jwtService.sign(payload);
  }
}