import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateItineraryDto {
  @ApiProperty({ example: 'Day 1: Arrival' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Description of the itinerary' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
