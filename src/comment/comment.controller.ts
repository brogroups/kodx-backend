import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDto } from './comment.dto';
import { CurrentUser } from 'src/decorators/user.decorator';
import { Auth } from 'src/decorators/auth.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @Auth()
  create(@Body() dto: CommentDto, @CurrentUser('id') userId: string) {
    return this.commentService.create(dto, userId);
  }

  @Put(':id')
  @Auth()
  update(
    @Body() dto: CommentDto,
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.commentService.update(dto, id, userId);
  }

  @Delete(":id")
  @Auth()
  delete(@Param("id") id:string,@CurrentUser("id") userId:string){
    return this.commentService.delete(id,userId)
  }
}
