import { Controller, Get, Post, Body, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  // Email/Password Registration
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // Email/Password Login
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Google OAuth Login
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Initiates Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const { user, access_token } = await this.authService.googleLogin(req.user);
    
    // Redirect to frontend with token
    const frontendUrl = this.configService.get('FRONTEND_URL');
    return res.redirect(
      `${frontendUrl}/auth/callback?token=${access_token}`
    );
  }

  // Get Current User Profile
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    return req.user;
  }

  // Logout
  @Get('logout')
  async logout(@Res() res: Response) {
    // For stateless JWT, just return success
    // Frontend will remove the token
    return res.status(HttpStatus.OK).json({ message: 'Logged out successfully' });
  }
}