import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateTouristTicketDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  studentDiscount?: number = 0;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  childDiscount?: number = 0;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  nationalDiscount?: number = 0;

  @IsBoolean()
  @IsOptional()
  requiresPassport?: boolean = false;

  @IsBoolean()
  @IsOptional()
  onlineAvailable?: boolean = true;
}
