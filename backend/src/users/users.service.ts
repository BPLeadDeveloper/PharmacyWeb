import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { id: 'asc' },
      include: {
        posts: true, // since schema has posts relation
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { posts: true },
    });

    if (!user) {
      throw new NotFoundException(`User with id=${id} not found`);
    }

    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    // Ensure user exists before updating (better DX)
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.email !== undefined ? { email: dto.email } : {}),
        ...(dto.name !== undefined ? { name: dto.name } : {}),
      },
      include: { posts: true },
    });
  }

  async remove(id: number) {
    // Ensure user exists
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
