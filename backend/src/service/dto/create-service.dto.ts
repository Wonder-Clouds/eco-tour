import {
  IsEnum,
  IsBoolean,
  IsOptional,
  IsNumber,
  Min,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceType } from '../../shared/enums/ServiceType';
import { CreateDetailServiceDto } from '../../detail-service/dto/create-detail-service.dto';

export class CreateServiceDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  // Requerido para GROUP y FORMULA_PRIVATE
  @ValidateIf((o: CreateServiceDto) => o.serviceType !== ServiceType.ARBITRARY)
  @IsNumber()
  @Min(0)
  feeSupplier?: number = 0;

  @ValidateIf((o: CreateServiceDto) => o.serviceType !== ServiceType.ARBITRARY)
  @IsNumber()
  @Min(0)
  commissionByService?: number = 0;

  @ValidateIf((o: CreateServiceDto) => o.serviceType !== ServiceType.ARBITRARY)
  @IsNumber()
  @Min(0)
  commissionCard?: number = 0;

  @IsNumber()
  @IsOptional()
  @Min(0)
  finalPrice?: number = 0;

  // Requerido solo para ArbitraryService
  @ValidateIf((o: CreateServiceDto) => o.serviceType === ServiceType.ARBITRARY)
  @IsNumber()
  @Min(0)
  predefinedPrice?: number = 0;

  // DetailService anidado - REQUERIDO para crear tours completos
  @ValidateNested()
  @Type(() => CreateDetailServiceDto)
  detailService: CreateDetailServiceDto;
}
