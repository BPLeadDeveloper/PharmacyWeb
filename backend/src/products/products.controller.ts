import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { Roles } from "src/decorators/index";
import { JwtAuthGuard, RolesGuard } from "src/auth/guards/index";
import { AddBrandDTORequest, AddBrandDTOReturn, DeleteBrandDTORequest, GetBrandDTOResponse, UpdateBrandDTORequest, UpdateBrandDTOResponse } from "./dto/index";


@Controller('products')
export class ProductsController {
    constructor(
        private productsService: ProductsService
    ) { }

    @Post('create-brand')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'LEAD_PHARMACIST')
    createBrand(@Body() addBrandDTO: AddBrandDTORequest): Promise<AddBrandDTOReturn> {
        return this.productsService.createBrands(addBrandDTO);
    }

    @Patch('update-brand')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    updateBrand(@Body() updateBrandDTO: UpdateBrandDTORequest): Promise<UpdateBrandDTOResponse> {
        return this.productsService.updateBrands(updateBrandDTO);
    }

    @Delete('delete-brand')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    deleteBrand(@Body() deleteBrandDTO: DeleteBrandDTORequest): Promise<GetBrandDTOResponse> {
        return this.productsService.deleteBrands(deleteBrandDTO);
    }

    @Get('get-brands')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'LEAD_PHARMACIST', 'PHARMACIST')
    getBrands(): Promise<GetBrandDTOResponse[]> {
        return this.productsService.getBrands();
    }

}