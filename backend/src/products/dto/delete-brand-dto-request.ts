import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteBrandDTORequest {
    @IsNumber()
    @IsNotEmpty()
    brandID: number;
}