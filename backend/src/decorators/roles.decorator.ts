import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/auth/auth.service';

export const ROLES_KEY = 'roles';

/**
 * Decorator to specify which user types can access an endpoint
 * @param roles - Array of user types: 'CUSTOMER', 'PHARMACIST', or 'ADMIN'
 * 
 * Example:
 * @Roles('CUSTOMER') // Only customers
 * @Roles('PHARMACIST', 'ADMIN') // Pharmacists and admins
 */
export const Roles = (...roles: UserType[]) => SetMetadata(ROLES_KEY, roles);