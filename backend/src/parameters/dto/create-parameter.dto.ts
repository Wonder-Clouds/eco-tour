import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsOptional } from 'class-validator';

export class CreateParameterDto {
  @ApiProperty({ example: '3.50' })
  @IsDecimal()
  @IsOptional()
  dollarFee: number;

  @ApiProperty({ example: '5.00' })
  @IsDecimal()
  @IsOptional()
  commissionCard: number;
}
