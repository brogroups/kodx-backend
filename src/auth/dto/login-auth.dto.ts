import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({ example: '123456', description: 'password' })
  @IsString()
  password: string;

  @ApiProperty({ example: '+998995553366', description: 'phone' })
  @Matches(/^\+998(33|55|77|88|90|91|93|94|95|97|98|99)\d{7}$/, {
    message: 'Telefon raqam formati noto‘g‘ri. Masalan: +998901234567',
  })
  @IsString()
  phone: string;
}
