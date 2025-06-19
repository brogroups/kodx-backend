import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CommentDto {
  @ApiProperty({ example: 'video_id', description: 'video_id' })
  @IsString()
  video_id: string;

  @ApiProperty({example:"comment",description:"comment"})
  @IsString()
  comment: string

}
