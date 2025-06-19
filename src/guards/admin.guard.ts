import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;
    const token = request.headers['authorization']?.split(' ')[1] || '';
    const verify = this.jwt.verify(token);
    const admin = await this.userService.getUserById(verify.id);
    if (admin?.role !== 'admin') {
      throw new ForbiddenException("you aren't admin");
    }
    return true;
  }
}
