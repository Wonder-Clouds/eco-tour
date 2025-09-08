import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Package, PackagePricing } from './entities/package.entity';
import { Service } from '../service/entities/service.entity';
import { DetailService } from '../detail-service/entities/detail-service.entity';
import { ServiceService } from '../service/service.service';
import {
  CreatePackageDto,
  AddServiceToPackageDto,
  CalculatePackagePriceDto,
} from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private packageRepository: Repository<Package>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    private serviceService: ServiceService,
    private dataSource: DataSource,
  ) {}

  async create(createPackageDto: CreatePackageDto): Promise<Package> {
    return await this.dataSource.transaction(async (manager) => {
      // 1. Crear DetailService para el paquete
      const detailService = manager.create(
        DetailService,
        createPackageDto.detailService,
      );
      const savedDetailService = await manager.save(
        DetailService,
        detailService,
      );

      // 2. Obtener servicios existentes si se proporcionaron IDs
      let existingServices: Service[] = [];
      if (createPackageDto.serviceIds?.length) {
        existingServices = await manager.find(Service, {
          where: { id: In(createPackageDto.serviceIds) },
          relations: ['detailService'],
        });

        if (existingServices.length !== createPackageDto.serviceIds.length) {
          throw new BadRequestException('One or more service IDs not found');
        }
      }

      // 3. Crear servicios nuevos si se proporcionaron
      const newServices: Service[] = [];
      if (createPackageDto.newServices?.length) {
        for (const newServiceDto of createPackageDto.newServices) {
          const createdService =
            await this.serviceService.create(newServiceDto);
          newServices.push(createdService);
        }
      }

      // 4. Combinar servicios existentes y nuevos
      const allServices = [...existingServices, ...newServices];

      if (allServices.length === 0) {
        throw new BadRequestException(
          'Package must contain at least one service',
        );
      }

      // 5. Crear el paquete
      const packageEntity = manager.create(Package, {
        name: createPackageDto.name,
        description: createPackageDto.description,
        discountPercentage: createPackageDto.discountPercentage || 0,
        validityDays: createPackageDto.validityDays || 30,
        isActive: createPackageDto.isActive ?? true,
        detailService: savedDetailService,
        services: allServices,
      });

      return await manager.save(Package, packageEntity);
    });
  }

  async findAll(): Promise<Package[]> {
    return await this.packageRepository.find({
      relations: ['detailService', 'services', 'services.detailService'],
    });
  }

  async findOne(id: string): Promise<Package> {
    const packageEntity = await this.packageRepository.findOne({
      where: { id },
      relations: ['detailService', 'services', 'services.detailService'],
    });

    if (!packageEntity) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }

    return packageEntity;
  }

  async update(
    id: string,
    updatePackageDto: UpdatePackageDto,
  ): Promise<Package> {
    const packageEntity = await this.findOne(id);

    Object.assign(packageEntity, updatePackageDto);

    return await this.packageRepository.save(packageEntity);
  }

  async remove(id: string): Promise<void> {
    // Verificar que el paquete existe antes de eliminarlo
    await this.findOne(id);
    await this.packageRepository.softDelete(id);
  }

  // Método para calcular el precio total del paquete
  async calculatePackagePrice(
    id: string,
    calculateDto: CalculatePackagePriceDto,
  ): Promise<PackagePricing> {
    const packageEntity = await this.findOne(id);

    return await packageEntity.calculateTotalPrice(
      calculateDto.participants,
      calculateDto.options,
    );
  }

  // Método para agregar un servicio existente al paquete
  async addServiceToPackage(
    packageId: string,
    addServiceDto: AddServiceToPackageDto,
  ): Promise<Package> {
    return await this.dataSource.transaction(async (manager) => {
      const packageEntity = await this.findOne(packageId);
      const service = await this.serviceRepository.findOne({
        where: { id: addServiceDto.serviceId },
      });

      if (!service) {
        throw new NotFoundException(
          `Service with ID ${addServiceDto.serviceId} not found`,
        );
      }

      // Verificar si el servicio ya está en el paquete
      const serviceExists = packageEntity.services.some(
        (s) => s.id === service.id,
      );
      if (serviceExists) {
        throw new BadRequestException('Service is already in this package');
      }

      packageEntity.services.push(service);
      return await manager.save(Package, packageEntity);
    });
  }

  // Método para remover un servicio del paquete
  async removeServiceFromPackage(
    packageId: string,
    serviceId: string,
  ): Promise<Package> {
    return await this.dataSource.transaction(async (manager) => {
      const packageEntity = await this.findOne(packageId);

      const serviceIndex = packageEntity.services.findIndex(
        (s) => s.id === serviceId,
      );
      if (serviceIndex === -1) {
        throw new NotFoundException('Service not found in this package');
      }

      if (packageEntity.services.length <= 1) {
        throw new BadRequestException(
          'Package must contain at least one service',
        );
      }

      packageEntity.services.splice(serviceIndex, 1);
      return await manager.save(Package, packageEntity);
    });
  }

  // Método para obtener todos los servicios de un paquete
  async getPackageServices(packageId: string): Promise<Service[]> {
    const packageEntity = await this.findOne(packageId);
    return packageEntity.services;
  }
}
