import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CommentDto } from './comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CommentDto, user_id: string) {
    return this.prisma.comment.create({
      data: {
        ...dto,
        user_id,
      },
    });
  }

  async findAll(video_id: string) {
    return this.prisma.comment.findMany({
      where: {
        video_id,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.comment.findFirst({ where: { id } });
  }

  async update(dto: Partial<CommentDto>, commentId: string, userId: string) {
    const comment = await this.findOne(commentId);

    if (!comment) throw new NotFoundException('Comment not found');

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { ...dto, user_id: userId },
    });
  }

  async delete(id: string, user_id: string) {
    const comment = await this.findOne(id);

    if (!comment) throw new NotFoundException('Comment not found');

    return this.prisma.comment.delete({
      where: {
        id,
        user_id,
      },
    });
  }
}
