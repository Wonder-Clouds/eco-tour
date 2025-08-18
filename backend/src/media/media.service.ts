import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {}

  async create(createMediaDto: CreateMediaDto) {
    return await this.mediaRepository.save(createMediaDto);
  }

  async findAll() {
    return await this.mediaRepository.find({
      select: ['id', 'type', 'url', 'isCover'],
    });
  }

  async findOne(id: string) {
    return await this.mediaRepository.findOneBy({ id });
  }

  async update(id: string, updateMediaDto: UpdateMediaDto) {
    await this.mediaRepository.update(id, updateMediaDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.mediaRepository.delete(id);
    return `This action removes a #${id} media`;
  }
}
