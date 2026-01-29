import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateBrandDTORequest {
    @IsNotEmpty()
    @IsNumber()
    brandID: number;

    @IsString()
    brandName?: string | null;

    @IsString()
    originCountry?: string | null;

    @IsString()
    manufacturerName?: string | null;

    @IsString()
    webURL?: string | null;

    @IsBoolean()
    isActive?: boolean | null;
}