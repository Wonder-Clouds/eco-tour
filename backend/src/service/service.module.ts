import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { Service } from './entities/service.entity';
import { GroupService } from './entities/group-service.entity';
import { PrivateService } from './entities/private-service.entity';
import { ArbitraryService } from './entities/arbitrary-service.entity';
import { TransportOption } from '../transport/entities/transport-option.entity';
import { TouristTicket } from '../ticket/entities/tourist-ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Service,
      GroupService,
      PrivateService,
      ArbitraryService,
      TransportOption,
      TouristTicket,
    ]),
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
