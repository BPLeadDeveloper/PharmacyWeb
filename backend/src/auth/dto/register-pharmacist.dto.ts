import { IsEmail, IsString, MinLength, IsOptional, IsDateString, Matches, IsIn } from 'class-validator';

export class RegisterPharmacistDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone number must be valid' })
  phone: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  @MinLength(2)
  first_name: string;

  @IsString()
  @MinLength(2)
  last_name: string;

  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @IsString()
  @IsIn(['PHARMACIST', 'LEAD_PHARMACIST'])
  pharmacist_role: string;

  @IsString()
  pharmacist_license_number: string;

  @IsString()
  license_state: string;

  @IsDateString()
  license_expiry_date: string;

  @IsOptional()
  assigned_by?: string; // Admin ID who is creating this pharmacist
}