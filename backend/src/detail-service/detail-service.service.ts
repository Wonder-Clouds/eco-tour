import { Injectable } from '@nestjs/common';
import { CreateDetailServiceDto } from './dto/create-detail-service.dto';
import { UpdateDetailServiceDto } from './dto/update-detail-service.dto';

@Injectable()
export class DetailServiceService {
  create(createDetailServiceDto: CreateDetailServiceDto) {
    return 'This action adds a new detailService';
  }

  findAll() {
    return `This action returns all detailService`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detailService`;
  }

  update(id: number, updateDetailServiceDto: UpdateDetailServiceDto) {
    return `This action updates a #${id} detailService`;
  }

  remove(id: number) {
    return `This action removes a #${id} detailService`;
  }
}
