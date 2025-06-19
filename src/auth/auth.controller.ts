import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  login(@Body() dto: LoginAuthDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  register(@Body() dto: RegisterAuthDto) {
    return this.authService.register(dto);
  }

  @HttpCode(200)
  @Auth()
  @ApiBearerAuth()
  @Post('login/access-token')
  async getnewTokens(@Req() req: Request) {
    const token = req.headers['authorization']?.split(' ')[1] || ""
    const { refreshToken, ...response } =
      await this.authService.getnewTokens(token);
    return response;
  }
}
