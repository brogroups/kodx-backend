import { Body, Controller, Param, Post } from '@nestjs/common';
import { LikeService } from './like.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Auth } from 'src/decorators/auth.decorator';
import { CurrentUser } from 'src/decorators/user.decorator';

@ApiBearerAuth()
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('comment/:id')
  @Auth()
  comment(
    @CurrentUser('id') userId: string,
    @Param('id') commentId: string,
  ) {
    return this.likeService.likeComment(commentId, userId);
  }

  @Post('video/:id')
  @Auth()
  video(
    @CurrentUser('id') userId: string,
    @Param('id') videoId: string,
  ) {
    return this.likeService.likeVideo(videoId, userId);
  }
}
