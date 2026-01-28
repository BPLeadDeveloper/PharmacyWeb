import { Injectable } from "@nestjs/common";
import { AddBrandDTORequest, AddBrandDTOReturn } from "./dto/index";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProductsService {
    constructor(
        private prismaService: PrismaService
    ) { }

    getBrands() {
        return ""
    }

    async createBrands(addBrandDTO: AddBrandDTORequest): Promise<AddBrandDTOReturn> {

        const { brandName, originCountry, manufacturerName, webURL, isActive } = addBrandDTO;

        try {
            const createdBrand = await this.prismaService.brands.create({
                data: {
                    brand_name: brandName,
                    origin_country: originCountry,
                    manufacturer_name: manufacturerName,
                    web_url: webURL,
                    is_active: isActive
                },
                select: {
                    brand_id: true,
                    brand_name: true,
                }
            })

            return Promise.resolve(createdBrand)

        } catch (error) {
            return Promise.reject(error);
        }
    }

    updateBrands() {
        return ""
    }

    deleteBrands() {
        return ""
    }
}