import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItineraryModule } from './itinerary/itinerary.module';
import { MediaModule } from './media/media.module';
import { DataModule } from './data/data.module';
import { DetailServiceModule } from './detail-service/detail-service.module';
import { ParametersModule } from './parameters/parameters.module';
import { ServiceModule } from './service/service.module';
import { PackageModule } from './package/package.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ItineraryModule,
    MediaModule,
    DataModule,
    DetailServiceModule,
    ParametersModule,
    ServiceModule,
    PackageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
