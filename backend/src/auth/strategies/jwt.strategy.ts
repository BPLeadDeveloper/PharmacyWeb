import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService, UserType } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Extract JWT from httpOnly cookie
        (request: Request) => {
          return request?.cookies?.access_token;
        },
        // Fallback to Authorization header for API clients
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
  }

  async validate(payload: any) {

    const issuer = this.configService.get<string>("JWT_ISSUER");
    const audience = this.configService.get<string>("JWT_AUDIENCE");

    if (payload.iss !== issuer || payload.aud !== audience) {
      throw new UnauthorizedException("Invalid JWT issuer or audience");
    }
    
    const user = await this.authService.validateUser(
      BigInt(payload.sub),
      payload.user_type as UserType
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    // Return user object that will be attached to request
    return user;
  }
}