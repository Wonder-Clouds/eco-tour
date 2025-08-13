import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { Datum } from './entities/datum.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Datum])],
  controllers: [DataController],
  providers: [DataService],
})
export class DataModule {}
