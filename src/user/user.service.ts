import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'argon2';
import { Role } from 'prisma/generated/prisma';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: string) {
    return this.prisma.user.findFirst({
      where: { id },
    });
  }

  async getByPhone(phone: string) {
    return this.prisma.user.findFirst({
      where: {
        phone,
      },
    });
  }

  async create(dto: RegisterAuthDto, role: Role) {
    return this.prisma.user.create({
      data: { ...dto, role, password: await hash(dto.password) },
    });
  }

  async getProfile(id: string) {
    const profile = await this.getUserById(id);
    if (!profile) {
      throw new NotFoundException('User not found');
    }

    const { password, role, ...user } = profile;

    return user;
  }

  async update(dto: Partial<RegisterAuthDto>, id: string) {
    const profile = await this.getUserById(id);
    if (!profile) {
      throw new NotFoundException('User not found');
    }
    const { password, role, ...user } = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...dto,
        password: await hash(dto.password || ''),
      },
    });
    return user
  }
}
