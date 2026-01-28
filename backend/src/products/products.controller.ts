import { Controller, Delete, ForbiddenException, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { Roles } from "src/decorators/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";



@Controller('products')
export class ProductsController {
    constructor(
        private productsService: ProductsService
    ) {}

    @Post('create-brand')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    createBrand() {
        return this.productsService.createBrands();
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