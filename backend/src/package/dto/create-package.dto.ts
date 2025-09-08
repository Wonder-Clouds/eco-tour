import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDetailServiceDto } from '../../detail-service/dto/create-detail-service.dto';
import { CreateServiceDto } from '../../service/dto/create-service.dto';

export class CreatePackageDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  discountPercentage?: number = 0;

  @IsNumber()
  @Min(1)
  @IsOptional()
  validityDays?: number = 30;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  // Opción 1: Crear paquete con servicios existentes (solo IDs)
  @IsArray()
  @IsUUID(4, { each: true })
  @IsOptional()
  serviceIds?: string[];

  // Opción 2: Crear paquete con servicios nuevos (anidados)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceDto)
  @IsOptional()
  newServices?: CreateServiceDto[];

  // DetailService del paquete
  @ValidateNested()
  @Type(() => CreateDetailServiceDto)
  detailService: CreateDetailServiceDto;
}

// DTO para agregar servicios existentes a un paquete
export class AddServiceToPackageDto {
  @IsUUID()
  serviceId: string;
}

// DTO para calcular precios de paquete
export class CalculatePackagePriceDto {
  @IsNumber()
  @Min(1)
  participants: number;

  @IsOptional()
  options?: {
    students?: number;
    children?: number;
    nationals?: number;
  };
}
