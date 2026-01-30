import { Controller, Post, Body, Get, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard, RolesGuard } from './guards';
import { Roles, GetUser } from "../decorators";
import { RegisterCustomerDto, RegisterAdminDto, RegisterPharmacistDto, LoginDto } from './dto';
import type { Response } from 'express';
import type { AuthUser } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) { }

  private setAuthCookie(res: Response, token: string) {
    const isProd = this.configService.get('NODE_ENV') === 'production';

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: isProd, 
      sameSite: isProd ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      path: '/',
    });
  }

  @Post('register/customer')
  async registerCustomer(
    @Body() registerDto: RegisterCustomerDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.registerCustomer(registerDto);

    this.setAuthCookie(res, result.token);

    return {
      message: 'Registration successful',
      user: result.user,
    };
  }

  @Post('register/pharmacist')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async registerPharmacist(
    @Body() registerDto: RegisterPharmacistDto,
    @GetUser() admin: AuthUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.registerPharmacist(registerDto, admin.id);

    this.setAuthCookie(res, result.token);

    return {
      message: 'Pharmacist registered successfully',
      user: result.user,
    };
  }

  @Post('register/admin')
  async registerAdmin(
    @Body() registerDto: RegisterAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.registerAdmin(registerDto);

    this.setAuthCookie(res, result.token);

    return {
      message: 'Admin registered successfully',
      user: result.user,
    };
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    this.setAuthCookie(res, result.token);

    return {
      message: 'Login successful',
      user: result.user,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@GetUser() user: AuthUser) {
    return {
      id: user.id.toString(),
      email: user.email,
      phone: user.phone,
      first_name: user.first_name,
      last_name: user.last_name,
      user_type: user.user_type,
      pharmacist_role: user.pharmacist_role,
      admin_level: user.admin_level,
      is_active: user.is_active,
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {

    res.clearCookie('access_token', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: this.configService.get('NODE_ENV') === 'production' ? 'strict' : 'lax',
      path: '/',
    });

    return {
      message: 'Logged out successfully'
    };
  }

  @Get('test/customer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  testCustomer(@GetUser() user: AuthUser) {
    return {
      message: 'Customer endpoint accessed',
      user: user
    };
  }

  @Get('test/pharmacist')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PHARMACIST')
  testPharmacist(@GetUser() user: AuthUser) {
    return {
      message: 'Pharmacist endpoint accessed',
      user: user
    };
  }

  @Get('test/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  testAdmin(@GetUser() user: AuthUser) {
    return {
      message: 'Admin endpoint accessed',
      user: user
    };
  }
}