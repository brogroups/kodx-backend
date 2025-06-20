import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { Admin } from 'src/decorators/admin.decorator';
import { VideoDto } from './video.dto';
import { Express } from 'express';

@ApiBearerAuth()
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        video: {
          type: 'string',
          format: 'binary',
          description: 'Yuklanadigan video fayl',
        },
        name: { type: 'string' },
        duration: { type: 'string' },
        description: { type: 'string' },
        sub_description: { type: 'string' },
        private: { type: 'boolean' },
        is_payment: { type: 'boolean' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './uploads/videos',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 200, 
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('video/')) {
          return cb(new Error('Faqat video fayllar yuklash mumkin!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @Auth()
  @Admin()
  uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: VideoDto,
  ) {
    const url = `/uploads/videos/${file.filename}`;
    return this.videoService.create(dto, url);
  }

  @Get('findAll')
  @Auth()
  findAll() {
    return this.videoService.findAll();
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(id);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        video: {
          type: 'string',
          format: 'binary',
          description: 'Yuklanadigan video fayl',
        },
        name: { type: 'string' },
        duration: { type: 'string' },
        description: { type: 'string' },
        sub_description: { type: 'string' },
        private: { type: 'boolean' },
        is_payment: { type: 'boolean' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './uploads/videos',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 200, 
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('video/')) {
          return cb(new Error('Faqat video fayllar yuklash mumkin!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @Auth()
  @Admin()
  update(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: VideoDto,
    @Param('id') id: string,
  ) {
    const url = `/uploads/videos/${file.filename}`;
    return this.videoService.update(dto, id, url);
  }

  @Delete(':id')
  @Auth()
  @Admin()
  delete(@Param('id') id: string) {
    return this.videoService.delete(id);
  }
}
