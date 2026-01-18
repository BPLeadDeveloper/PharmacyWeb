import { IsEmail, IsString, MinLength, IsDateString, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsDateString()
  @IsOptional()
  date_of_birth?: string;
}