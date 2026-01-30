import { SetMetadata } from '@nestjs/common';
import { PHARMACIST_ROLES_KEY } from 'src/auth/guards/pharmacist-role.guard';

/**
 * Decorator to specify which pharmacist roles can access an endpoint
 * @param roles - Array of pharmacist roles: 'PHARMACIST' or 'LEAD_PHARMACIST'
 * 
 * Example:
 * @PharmacistRoles('LEAD_PHARMACIST') // Only lead pharmacists
 * @PharmacistRoles('PHARMACIST', 'LEAD_PHARMACIST') // Both can access
 */
export const PharmacistRoles = (...roles: string[]) => 
  SetMetadata(PHARMACIST_ROLES_KEY, roles);