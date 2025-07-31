import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: { name: string; email: string; password: string; role?: Role }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'USER',
      },
    });
  }

  async getUsers() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true }, // Exclude password
    });
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: number, data: { name?: string; email?: string; password?: string; role?: Role }, currentUserId: number, currentUserRole: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    // if (currentUserId !== id && currentUserRole !== 'admin') throw new ForbiddenException('Unauthorized');

    if (data.password) data.password = await bcrypt.hash(data.password, 10);

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number, currentUserRole: string) {
    if (currentUserRole !== 'admin') throw new ForbiddenException('Only admins can delete users');
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.delete({ where: { id } });
  }
  async getUserByEmail(email: string) {
  return this.prisma.user.findUnique({
    where: { email },
  });
}
}