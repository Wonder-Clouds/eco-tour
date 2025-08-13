import { Injectable } from '@nestjs/common';
import { CreateDatumDto } from './dto/create-datum.dto';
import { UpdateDatumDto } from './dto/update-datum.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Datum } from './entities/datum.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DataService {
  constructor(
    @InjectRepository(Datum)
    private readonly dataRepository: Repository<Datum>,
  ) {}

  async create(createDatumDto: CreateDatumDto) {
    return await this.dataRepository.save(createDatumDto);
  }

  async findAll() {
    return await this.dataRepository.find({ select: ['title', 'description'] });
  }

  async findOne(id: string) {
    return await this.dataRepository.findOne({
      where: { id },
      select: ['title', 'description'],
    });
  }

  async update(id: string, updateDatumDto: UpdateDatumDto) {
    await this.dataRepository.update(id, updateDatumDto);
    return this.dataRepository.findOne({
      where: { id },
      select: ['title', 'description'],
    });
  }

  async remove(id: string) {
    await this.dataRepository.delete(id);
    return `This action removes a #${id} datum`;
  }
}
