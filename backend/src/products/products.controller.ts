import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { Roles } from "src/decorators/index";
import { JwtAuthGuard, PharmacistRoleGuard, RolesGuard } from "src/auth/guards/index";
import { AddBrandDTORequest, AddBrandDTOReturn, DeleteBrandDTORequest, GetBrandDTOResponse, UpdateBrandDTORequest, UpdateBrandDTOResponse } from "./dto/index";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
    constructor(
        private productsService: ProductsService
    ) { }

    @Post('create-brand')
    @UseGuards(PharmacistRoleGuard)
    @Roles('ADMIN', 'PHARMACIST')
    createBrand(@Body() addBrandDTO: AddBrandDTORequest): Promise<AddBrandDTOReturn> {
        return this.productsService.createBrands(addBrandDTO);
    }

    @Patch('update-brand')
    @Roles('ADMIN')
    updateBrand(@Body() updateBrandDTO: UpdateBrandDTORequest): Promise<UpdateBrandDTOResponse> {
        return this.productsService.updateBrands(updateBrandDTO);
    }

    @Delete('delete-brand')
    @Roles('ADMIN')
    deleteBrand(@Body() deleteBrandDTO: DeleteBrandDTORequest): Promise<GetBrandDTOResponse> {
        return this.productsService.deleteBrands(deleteBrandDTO);
    }

    @Get('get-brands')
    @Roles('ADMIN', 'PHARMACIST')
    getBrands(): Promise<GetBrandDTOResponse[]> {
        return this.productsService.getBrands();
    }

    @Get('get-brand-by-id')
    @Roles('ADMIN', 'PHARMACIST')
    getBrandByID(@Query('brandID') brandID: number): Promise<GetBrandDTOResponse> {
        return this.productsService.getBrandByID(brandID);
    }

}