import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('db-health')
  async health() {
    // Tests DB connectivity
    const result = await this.prisma.user.count();
    return { ok: true, userCount: result };
  }
}
