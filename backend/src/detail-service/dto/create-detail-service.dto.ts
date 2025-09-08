import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested, IsOptional } from 'class-validator';
import { CreateDatumDto } from 'src/data/dto/create-datum.dto';
import { CreateItineraryDto } from 'src/itinerary/dto/create-itinerary.dto';
import { CreateMediaDto } from 'src/media/dto/create-media.dto';

export class CreateDetailServiceDto {
  @ApiProperty({ example: 'Machu Picchu Full Day Tour' })
  @IsString()
  title: string;

  @ApiProperty({ example: '12 hours' })
  @IsString()
  duration: string;

  @ApiProperty({
    example: 'Discover the wonder of Machu Picchu with expert guides',
  })
  @IsString()
  summary: string;

  @ApiProperty({ example: 'Transportation, guide, entrance fees' })
  @IsString()
  includes: string;

  @ApiProperty({ example: 'Meals, personal expenses' })
  @IsString()
  notIncludes: string;

  @ApiProperty({
    example: [
      { title: 'Altitude', description: '2,430 meters above sea level' },
    ],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDatumDto)
  @IsOptional()
  data?: CreateDatumDto[];

  @ApiProperty({
    example: [
      {
        title: 'Day 1: Journey to Machu Picchu',
        description: 'Early morning departure...',
      },
    ],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItineraryDto)
  @IsOptional()
  itinerary?: CreateItineraryDto[];

  @ApiProperty({
    example: [
      {
        type: 'COVER',
        url: 'https://example.com/machu-picchu.jpg',
        isCover: true,
      },
    ],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMediaDto)
  @IsOptional()
  media?: CreateMediaDto[];
}
