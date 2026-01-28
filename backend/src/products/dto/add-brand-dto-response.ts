import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddBrandDTOReturn{
    @IsNumber()
    @IsNotEmpty()
    brand_id: number;

    @IsString()
    @IsNotEmpty()
    brand_name: string;
}