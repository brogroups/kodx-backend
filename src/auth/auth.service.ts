import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
  ) {}

  async login(dto: LoginAuthDto) {
    const { password, role, ...user } = await this.ValidateUser(dto);

    const tokens = await this.tokens(user.id);

    return { user, ...tokens };
  }

  async register(dto: RegisterAuthDto) {
    const oldUser = await this.userService.getByPhone(dto.phone);

    if (oldUser) throw new BadRequestException('There is already user');

    const { password, role, ...user } = await this.userService.create(
      dto,
      'user',
    );
    const tokens = await this.tokens(user.id);

    return { user, ...tokens };
  }

  async getnewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('Invalid refresh token');

    const dbUser = await this.userService.getUserById(result.id);
    if (!dbUser) throw new UnauthorizedException('User not found');

    const { password,role, ...user } = dbUser;
    const token = await this.tokens(user.id);

    return { user, ...token };
  }

  private async ValidateUser(dto: LoginAuthDto) {
    const user = await this.userService.getByPhone(dto.phone);

    if (!user) throw new NotFoundException('user not found');

    const isValidPassword = await verify(user.password, dto.password);

    if (!isValidPassword) throw new UnauthorizedException('Invalid password');

    return user;
  }

  private async tokens(userId: string) {
    const data = { id: userId };

    const accessToken = await this.jwt.sign(data, { expiresIn: '1d' });
    const refreshToken = await this.jwt.sign(data, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }
}
