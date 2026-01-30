import { Controller, Delete, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { JwtAuthGuard, RolesGuard } from "src/auth/guards";
import { Roles } from "src/decorators";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
    constructor(
        private adminService: AdminService
    ) { }

    @Post('add-admin')
    addAdmin() {
    }

    @Delete('remove-admin')
    removeAdmin() {
    }

    @Patch('update-user')
    updateUser() {
    }
    
}