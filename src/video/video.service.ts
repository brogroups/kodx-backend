import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { VideoDto } from './video.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService) {}

  async create(dto: VideoDto, url: string) {
    console.log(dto.private || true);
    return this.prisma.video.create({
      data: {
        ...dto,
        is_payment: Boolean(dto.is_payment),
        private: Boolean(dto.private),
        url,
      },
    });
  }

  async findAll() {
    return this.prisma.video.findMany({
      include: {
        _count: {
          select: {
            likesVideo: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.video.findFirst({
      where: { id },
      include: {
        comments: {
          include: {
            _count: {
              select: {
                likes: true,
              },
            },
          },
        },
      },
    });
  }

  async update(dto: Partial<VideoDto>, id: string, url: string) {
    const video = await this.findOne(id);

    if (!video) throw new NotFoundException('video not found');
    this.deleteVideo(video.url);
    return this.prisma.video.update({
      where: {
        id,
      },
      data: {
        ...dto,
        is_payment: Boolean(dto.is_payment),
        private: Boolean(dto.private),
        url,
      },
    });
  }
  async delete(id: string) {
    const video = await this.findOne(id);

    if (!video) throw new NotFoundException('video not found');
    await this.deleteVideo(video.url);
    return this.prisma.video.delete({
      where: {
        id,
      },
    });
  }

  private deleteVideo(Videopath: string) {
    const url = path.join(process.cwd(), Videopath);
    fs.unlink(url, (err) => {
      if (err) {
        console.error(err);
        throw new InternalServerErrorException('Delete video err');
      }
      console.log('Video deleted');
    });
  }
}
