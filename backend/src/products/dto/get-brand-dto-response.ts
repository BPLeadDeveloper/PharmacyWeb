import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class GetBrandDTOResponse {
    @IsNumber()
    @IsNotEmpty()
    brandID: number;

    @IsNotEmpty()
    @IsString()
    brandName: string;

    @IsString()
    @IsOptional()
    originCountry?: string | null;

    @IsString()
    @IsOptional()
    manufacturerName?: string | null;

    @IsString()
    @IsOptional()
    webURL?: string | null;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean | null;
}