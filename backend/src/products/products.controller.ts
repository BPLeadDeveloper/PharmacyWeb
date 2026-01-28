import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { Roles } from "src/decorators/index";
import { JwtAuthGuard, RolesGuard } from "src/auth/guards/index";
import { AddBrandDTORequest, AddBrandDTOReturn } from "./dto/index";



@Controller('products')
export class ProductsController {
    constructor(
        private productsService: ProductsService
    ) { }

    @Post('create-brand')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    createBrand(@Body() addBrandDTO: AddBrandDTORequest): Promise<AddBrandDTOReturn> {
        return this.productsService.createBrands(addBrandDTO);
    }

    @Patch('update-brand')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    updateBrand() {
        return this.productsService.updateBrands();
    }

    @Delete('delete-brand')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    deleteBrand() {
        return this.productsService.deleteBrands();
    }

    @Get('get-brands')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    getBrands() {
        return this.productsService.getBrands();
    }

}