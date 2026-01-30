import { IsEmail, IsString, MinLength, IsOptional, IsDateString, Matches } from 'class-validator';

export class RegisterCustomerDto {
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
  emergency_contact_name: string;

  @IsString()
  emergency_contact_phone: string;
}