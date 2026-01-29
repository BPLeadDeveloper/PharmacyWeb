import { IsString, IsOptional, IsBoolean, IsUrl } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  brand_name: string;

  @IsOptional()
  @IsString()
  origin_country?: string;

  @IsOptional()
  @IsString()
  manufacturer_name?: string;

  @IsOptional()
  @IsUrl()
  web_url?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}