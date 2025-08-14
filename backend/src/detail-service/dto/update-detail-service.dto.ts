import { PartialType } from '@nestjs/swagger';
import { CreateDetailServiceDto } from './create-detail-service.dto';

export class UpdateDetailServiceDto extends PartialType(CreateDetailServiceDto) {}
