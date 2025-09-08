import { Injectable } from '@nestjs/common';
import { CreateDetailServiceDto } from './dto/create-detail-service.dto';
import { UpdateDetailServiceDto } from './dto/update-detail-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailService } from './entities/detail-service.entity';
import { Repository, DataSource } from 'typeorm';
import { Datum } from 'src/data/entities/datum.entity';
import { Itinerary } from 'src/itinerary/entities/itinerary.entity';
import { Media } from 'src/media/entities/media.entity';

@Injectable()
export class DetailServiceService {
  constructor(
    @InjectRepository(DetailService)
    private detailServiceRepository: Repository<DetailService>,
    @InjectRepository(Datum)
    private datumRepository: Repository<Datum>,
    @InjectRepository(Itinerary)
    private itineraryRepository: Repository<Itinerary>,
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    private dataSource: DataSource,
  ) {}

  async create(createDetailServiceDto: CreateDetailServiceDto) {
    const detailService = this.detailServiceRepository.create(
      createDetailServiceDto,
    );
    return await this.detailServiceRepository.save(detailService);
  }

  async findAll() {
    return await this.detailServiceRepository.find({
      relations: ['data', 'itinerary', 'media'],
    });
  }

  async findOne(id: string) {
    return await this.detailServiceRepository.findOne({
      where: { id },
      relations: ['data', 'itinerary', 'media'],
    });
  }

  async update(id: string, updateDetailServiceDto: UpdateDetailServiceDto) {
    const detailService = await this.detailServiceRepository.findOne({
      where: { id },
      relations: ['data', 'itinerary', 'media'],
    });

    if (!detailService) {
      throw new Error('DetailService not found');
    }

    // Update basic properties
    Object.assign(detailService, {
      title: updateDetailServiceDto.title ?? detailService.title,
      duration: updateDetailServiceDto.duration ?? detailService.duration,
      summary: updateDetailServiceDto.summary ?? detailService.summary,
      includes: updateDetailServiceDto.includes ?? detailService.includes,
      notIncludes:
        updateDetailServiceDto.notIncludes ?? detailService.notIncludes,
    });

    // Handle nested data updates
    if (updateDetailServiceDto.data !== undefined) {
      // Soft delete existing data
      if (detailService.data?.length > 0) {
        await this.datumRepository.softDelete({
          detailService: { id: detailService.id },
        });
      }

      // Create new data entities
      const newData = updateDetailServiceDto.data.map((dataDto) => {
        const datum = this.datumRepository.create({
          ...dataDto,
          detailService,
        });
        return datum;
      });
      detailService.data = newData;
    }

    // Handle nested itinerary updates
    if (updateDetailServiceDto.itinerary !== undefined) {
      // Soft delete existing itinerary
      if (detailService.itinerary?.length > 0) {
        await this.itineraryRepository.softDelete({
          detailService: { id: detailService.id },
        });
      }

      // Create new itinerary entities
      const newItinerary = updateDetailServiceDto.itinerary.map(
        (itineraryDto) => {
          const itinerary = this.itineraryRepository.create({
            ...itineraryDto,
            detailService,
          });
          return itinerary;
        },
      );
      detailService.itinerary = newItinerary;
    }

    // Handle nested media updates
    if (updateDetailServiceDto.media !== undefined) {
      // Soft delete existing media
      if (detailService.media?.length > 0) {
        await this.mediaRepository.softDelete({
          detailService: { id: detailService.id },
        });
      }

      // Create new media entities
      const newMedia = updateDetailServiceDto.media.map((mediaDto) => {
        const media = this.mediaRepository.create({
          ...mediaDto,
          detailService,
        });
        return media;
      });
      detailService.media = newMedia;
    }

    const savedDetailService =
      await this.detailServiceRepository.save(detailService);

    // Return the updated entity with relations
    return await this.detailServiceRepository.findOne({
      where: { id: savedDetailService.id },
      relations: ['data', 'itinerary', 'media'],
    });
  }

  async remove(id: string) {
    await this.detailServiceRepository.softDelete(id);
    return { deleted: true };
  }
}
