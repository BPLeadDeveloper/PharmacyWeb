import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const PHARMACIST_ROLES_KEY = 'pharmacist_roles';

/**
 * Guard to check specific pharmacist roles (PHARMACIST vs LEAD_PHARMACIST)
 * Use this in addition to RolesGuard when you need to differentiate between pharmacist types
 */
@Injectable()
export class PharmacistRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPharmacistRoles = this.reflector.getAllAndOverride<string[]>(
      PHARMACIST_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPharmacistRoles) {
      return true; // No specific pharmacist role required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // User must be a pharmacist
    if (user.user_type !== 'PHARMACIST') {
      throw new ForbiddenException('Only pharmacists can access this resource');
    }

    // Check if pharmacist has the required role
    const hasRole = requiredPharmacistRoles.includes(user.pharmacist_role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required pharmacist roles: ${requiredPharmacistRoles.join(', ')}`
      );
    }

    return true;
  }
}