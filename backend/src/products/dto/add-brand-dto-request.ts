import { IsBoolean, isBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AddBrandDTORequest {
    @IsNotEmpty()
    @IsString()
    brandName: string;

    @IsString()
    @IsOptional()
    originCountry?: string;

    @IsString()
    @IsOptional()
    manufacturerName?: string;

    @IsString()
    @IsOptional()
    webURL?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}