import { Module } from '@nestjs/common';
import { DetailServiceService } from './detail-service.service';
import { DetailServiceController } from './detail-service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailService } from './entities/detail-service.entity';
import { Datum } from 'src/data/entities/datum.entity';
import { Itinerary } from 'src/itinerary/entities/itinerary.entity';
import { Media } from 'src/media/entities/media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetailService, Datum, Itinerary, Media])],
  controllers: [DetailServiceController],
  providers: [DetailServiceService],
})
export class DetailServiceModule {}
