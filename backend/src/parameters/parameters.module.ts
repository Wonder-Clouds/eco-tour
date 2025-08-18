import { Module } from '@nestjs/common';
import { ParametersService } from './parameters.service';
import { ParametersController } from './parameters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parameter } from './entities/parameter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parameter])],
  controllers: [ParametersController],
  providers: [ParametersService],
})
export class ParametersModule {}
