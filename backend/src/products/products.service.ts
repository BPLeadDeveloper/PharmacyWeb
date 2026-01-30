import { Injectable } from "@nestjs/common";
import { AddBrandDTORequest, AddBrandDTOReturn, DeleteBrandDTORequest, GetBrandDTOResponse, UpdateBrandDTORequest, UpdateBrandDTOResponse } from "./dto/index";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProductsService {
    constructor(
        private prismaService: PrismaService
    ) { }

    async getBrands(): Promise<GetBrandDTOResponse[]> {
        try {

            const brandData = await this.prismaService.brands.findMany();

            const mappedData = brandData.map(brand => ({
                brandID: brand.brand_id,
                brandName: brand.brand_name,
                originCountry: brand.origin_country,
                manufacturerName: brand.manufacturer_name,
                webURL: brand.web_url,
                isActive: brand.is_active
            }));

            return Promise.resolve(mappedData)
        } catch (error) {
            return Promise.reject(error)
        }
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

    async updateBrands(updateBrandDTO: UpdateBrandDTORequest): Promise<UpdateBrandDTOResponse> {
        try {
            const { brandID, brandName, originCountry, manufacturerName, webURL, isActive } = updateBrandDTO;

            const updateData: any = {};

            if (brandName !== null && brandName !== undefined) updateData.brand_name = brandName;
            if (originCountry !== null && originCountry !== undefined) updateData.origin_country = originCountry;
            if (manufacturerName !== null && manufacturerName !== undefined) updateData.manufacturer_name = manufacturerName;
            if (webURL !== null && webURL !== undefined) updateData.web_url = webURL;
            if (isActive !== null && isActive !== undefined) updateData.is_active = isActive;

            const returnData = await this.prismaService.brands.update({
                where: {
                    brand_id: brandID
                },
                data: updateData
            })

            const responseData = {
                brandID: returnData.brand_id,
                brandName: returnData.brand_name,
                originCountry: returnData?.origin_country,
                manufacturerName: returnData?.manufacturer_name,
                webURL: returnData?.web_url,
                isActive: returnData?.is_active
            }

            return Promise.resolve(responseData)
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async deleteBrands(deleteBrandDTO: DeleteBrandDTORequest): Promise<GetBrandDTOResponse> {
        try {
            const { brandID } = deleteBrandDTO;

            const deletedBrand = await this.prismaService.brands.delete({
                where: {
                    brand_id: brandID
                }
            });

            if (!deletedBrand) {
                return Promise.reject(new Error('Brand not found'));
            }

            const returnData = {
                brandID: deletedBrand.brand_id,
                brandName: deletedBrand.brand_name,
                originCountry: deletedBrand?.origin_country,
                manufacturerName: deletedBrand?.manufacturer_name,
                webURL: deletedBrand?.web_url,
                isActive: deletedBrand?.is_active
            };

            return Promise.resolve(returnData);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getBrandByID(brandID: number): Promise<GetBrandDTOResponse> {
        try {
            const brand = await this.prismaService.brands.findUnique({
                where: {
                    brand_id: brandID
                }
            });

            if (!brand) {
                return Promise.reject(new Error('Brand not found'));
            }

            const returnData = {
                brandID: brand.brand_id,
                brandName: brand.brand_name,
                originCountry: brand?.origin_country,
                manufacturerName: brand?.manufacturer_name,
                webURL: brand?.web_url,
                isActive: brand?.is_active
            };

            return Promise.resolve(returnData);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}