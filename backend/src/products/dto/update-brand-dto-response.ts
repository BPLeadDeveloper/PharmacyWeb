import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateBrandDTOResponse {
    @IsNotEmpty()
    @IsNumber()
    brandID: number;

    @IsNotEmpty()
    @IsString()
    brandName: string;

    @IsOptional()
    @IsString()
    originCountry?: string | null;

    @IsOptional()
    @IsString()
    manufacturerName?: string | null;

    @IsOptional()
    @IsString()
    webURL?: string | null;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean | null;
}