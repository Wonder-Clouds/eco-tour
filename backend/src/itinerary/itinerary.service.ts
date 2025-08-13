import { Injectable } from '@nestjs/common';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { Repository } from 'typeorm';
import { Itinerary } from './entities/itinerary.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItineraryService {
  constructor(
    @InjectRepository(Itinerary)
    private readonly itineraryRepository: Repository<Itinerary>,
  ) {}

  async create(createItineraryDto: CreateItineraryDto) {
    return await this.itineraryRepository.save(createItineraryDto);
  }

  async findAll() {
    return await this.itineraryRepository.find();
  }

  async findOne(id: string) {
    return await this.itineraryRepository.findOne({
      where: { id },
      select: ['id', 'title', 'description'],
    });
  }

  async update(id: string, updateItineraryDto: UpdateItineraryDto) {
    await this.itineraryRepository.update(id, updateItineraryDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.itineraryRepository.delete(id);
    return `This action removes a #${id} itinerary`;
  }
}
