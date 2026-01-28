import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    imports : [PrismaModule],
    controllers: [ProductsController],
    providers: [ProductsService, PrismaService]
})
export class ProductsModule {}