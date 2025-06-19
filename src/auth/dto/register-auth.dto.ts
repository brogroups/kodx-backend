import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

export class RegisterAuthDto {
  @ApiProperty({ example: 'username', description: 'username' })
  @IsString()
  username: string;

  @ApiProperty({ example: '+998995553366', description: 'phone' })
  @Matches(/^\+998(33|55|77|88|90|91|93|94|95|97|98|99)\d{7}$/, {
    message: 'Telefon raqam formati noto‘g‘ri. Masalan: +998901234567',
  })
  @IsString()
  phone: string;

  @ApiProperty({ example: '123456', description: 'password' })
  @MinLength(6, { message: 'password must be than 6 or equal' })
  @IsString()
  password: string;
}
