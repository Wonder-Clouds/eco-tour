import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { DetailServiceService } from './detail-service.service';
import { CreateDetailServiceDto } from './dto/create-detail-service.dto';
import { UpdateDetailServiceDto } from './dto/update-detail-service.dto';

@Controller('detail-service')
export class DetailServiceController {
  constructor(private readonly detailServiceService: DetailServiceService) {}

  @Post()
  create(@Body() createDetailServiceDto: CreateDetailServiceDto) {
    return this.detailServiceService.create(createDetailServiceDto);
  }

  @Get()
  findAll() {
    return this.detailServiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detailServiceService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDetailServiceDto: UpdateDetailServiceDto,
  ) {
    try {
      return await this.detailServiceService.update(id, updateDetailServiceDto);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error updating detail service';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detailServiceService.remove(id);
  }
}
