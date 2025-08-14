import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDatumDto {
  @ApiProperty({ example: 'Altitude' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '3552 msnm.' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
