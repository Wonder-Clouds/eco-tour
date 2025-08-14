import { Module } from '@nestjs/common';
import { DetailServiceService } from './detail-service.service';
import { DetailServiceController } from './detail-service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailService } from './entities/detail-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetailService])],
  controllers: [DetailServiceController],
  providers: [DetailServiceService],
})
export class DetailServiceModule {}
