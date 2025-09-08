import { IsString, IsEnum, IsInt, IsNumber, Min } from 'class-validator';
import { VehicleType } from '../../shared/enums/VehicleType';

export class CreateTransportOptionDto {
  @IsString()
  city: string;

  @IsString()
  provider: string;

  @IsEnum(VehicleType)
  vehicleType: VehicleType;

  @IsInt()
  @Min(1)
  minPeople: number;

  @IsInt()
  @Min(1)
  maxPeople: number;

  @IsNumber()
  @Min(0)
  cost: number;
}
