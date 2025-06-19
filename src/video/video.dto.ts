import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class VideoDto {
  @ApiProperty({ example: 'My Video' })
  name: string;

  @ApiProperty({ example: false, description: 'Video shaxsiymi?' })
  @Transform(({ value }) => value === 'true' || value === true)
  private: boolean;

  @ApiProperty({ example: false, description: 'To‘lov kerakmi?' })
  @Transform(({ value }) => value === 'true' || value === true)
  is_payment: boolean;

  @ApiProperty({ example: 'Video haqida', description: 'Tavsif' })
  description: string;

  @ApiProperty({ example: 'Qo‘shimcha tavsif' })
  sub_description: string;

  @ApiProperty({ example: '02:30', required: false })
  duration?: string;
}
