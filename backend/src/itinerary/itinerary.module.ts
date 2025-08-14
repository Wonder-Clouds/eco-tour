import { Module } from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { ItineraryController } from './itinerary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Itinerary } from './entities/itinerary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Itinerary])],
  controllers: [ItineraryController],
  providers: [ItineraryService],
})
export class ItineraryModule {}
