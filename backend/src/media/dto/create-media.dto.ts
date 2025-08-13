import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { TypeMedia } from 'src/shared/enums/TypeMedia';

export class CreateMediaDto {
  @ApiProperty({ example: 'image' })
  @IsString()
  @IsEnum(TypeMedia)
  type: TypeMedia;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsString()
  url: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isCover: boolean;
}
