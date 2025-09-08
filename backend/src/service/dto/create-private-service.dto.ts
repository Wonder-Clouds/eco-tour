import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsOptional } from 'class-validator';
import { CreateServiceDto } from './create-service.dto';
import { CreateTransportOptionDto } from 'src/transport/dto/create-transport-option.dto';
import { CreateTouristTicketDto } from 'src/ticket/dto/create-tourist-ticket.dto';

export class CreatePrivateServiceDto extends CreateServiceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTransportOptionDto)
  @IsOptional()
  transportOptions?: CreateTransportOptionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTouristTicketDto)
  @IsOptional()
  touristTickets?: CreateTouristTicketDto[];
}
