import { Body, Controller, Get, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/decorators/auth.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/user.decorator';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  profile(@CurrentUser('id') userId: string) {
    return this.userService.getProfile(userId);
  }

  @Put('profile')
  @Auth()
  updateProfile(
    @Body() dto: RegisterAuthDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.userService.update(dto,userId);
  }
}
