import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Service } from './entities/service.entity';
import { GroupService } from './entities/group-service.entity';
import { PrivateService } from './entities/private-service.entity';
import { ArbitraryService } from './entities/arbitrary-service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { CreatePrivateServiceDto } from './dto/create-private-service.dto';
import { ServiceType } from '../shared/enums/ServiceType';
import { DetailService } from '../detail-service/entities/detail-service.entity';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(GroupService)
    private groupServiceRepository: Repository<GroupService>,
    @InjectRepository(PrivateService)
    private privateServiceRepository: Repository<PrivateService>,
    @InjectRepository(ArbitraryService)
    private arbitraryServiceRepository: Repository<ArbitraryService>,
    private dataSource: DataSource,
  ) {}

  async calculateServicePrice(
    serviceId: string,
    participants: number,
    options?: any,
  ): Promise<number> {
    const service = await this.findOne(serviceId);
    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    // Polimorfismo: cada tipo de servicio implementa su propio cálculo
    return await service.calculatePrice(participants, options);
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['detailService', 'transportOptions', 'touristTickets'],
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return service;
  }

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    // Usar transacción para crear service con detailService anidado
    return await this.dataSource.transaction(async (manager) => {
      // Crear DetailService primero con todas sus relaciones anidadas
      const detailService = manager.create(
        DetailService,
        createServiceDto.detailService,
      );
      const savedDetailService = await manager.save(
        DetailService,
        detailService,
      );

      // Crear el Service apropiado según el tipo
      let service: Service;

      switch (createServiceDto.serviceType) {
        case ServiceType.GROUP:
          service = manager.create(GroupService, {
            ...createServiceDto,
            detailService: savedDetailService,
          });
          return await manager.save(GroupService, service);

        case ServiceType.FORMULA_PRIVATE:
          service = manager.create(PrivateService, {
            ...(createServiceDto as CreatePrivateServiceDto),
            detailService: savedDetailService,
          });
          return await manager.save(PrivateService, service);

        case ServiceType.ARBITRARY:
          service = manager.create(ArbitraryService, {
            ...createServiceDto,
            detailService: savedDetailService,
          });
          return await manager.save(ArbitraryService, service);

        default:
          throw new Error(
            `Unsupported service type: ${String(createServiceDto.serviceType)}`,
          );
      }
    });
  }

  async findAll(): Promise<Service[]> {
    return await this.serviceRepository.find({
      relations: ['detailService', 'transportOptions', 'touristTickets'],
    });
  }

  async remove(id: string): Promise<void> {
    await this.serviceRepository.softDelete(id);
  }
}
