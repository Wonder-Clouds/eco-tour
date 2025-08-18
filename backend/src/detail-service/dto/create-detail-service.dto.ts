import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { CreateDatumDto } from 'src/data/dto/create-datum.dto';
import { CreateItineraryDto } from 'src/itinerary/dto/create-itinerary.dto';
import { CreateMediaDto } from 'src/media/dto/create-media.dto';

export class CreateDetailServiceDto {
  @ApiProperty({ example: 'Machu Picchu' })
  @IsString()
  title: string;

  @ApiProperty({ example: '5 days' })
  @IsString()
  duration: string;

  @ApiProperty({
    example: [{ title: 'Altitude', description: '3552 msnm.' }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDatumDto)
  data: CreateDatumDto[];

  @ApiProperty({ example: 'A beautiful place to visit.' })
  @IsString()
  summary: string;

  @ApiProperty({ example: 'Inclusions' })
  @IsString()
  includes: string;

  @ApiProperty({ example: 'Not Included' })
  @IsString()
  notIncludes: string;

  @ApiProperty({
    example: [
      { day: 1, title: 'Arrival', description: 'Arrive at the destination.' },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => CreateItineraryDto)
  itinerary: CreateItineraryDto[];

  @ApiProperty({
    example: [
      {
        type: 'image',
        url: 'https://example.com/image.jpg',
        isCover: false,
      },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => CreateMediaDto)
  media: CreateMediaDto[];
}
