import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async likeComment(commentId: string, userId: string) {
    const oldLike = await this.prisma.like.findFirst({
      where: { userId, commentId },
    });

    if (oldLike) {
      await this.prisma.like.delete({
        where: { userId_commentId: { userId, commentId } },
      });
      return { liked: false };
    } else {
      await this.prisma.like.create({
        data: { userId, commentId },
      });
      return { liked: true };
    }
  }

  async likeVideo(videoId: string, userId: string) {
    const oldLike = await this.prisma.likeVideo.findFirst({
      where: { userId, videoId },
    });

    if (oldLike) {
      await this.prisma.likeVideo.delete({
        where: { userId_videoId: { userId, videoId } },
      });
      return { liked_video: false };
    } else {
      await this.prisma.likeVideo.create({
        data: { userId, videoId },
      });
      return { liked_video: true };
    }
  }
}
