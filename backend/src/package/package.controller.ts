import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PackageService } from './package.service';
import {
  CreatePackageDto,
  AddServiceToPackageDto,
  CalculatePackagePriceDto,
} from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

@Controller('packages')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Post()
  async create(@Body() createPackageDto: CreatePackageDto) {
    return await this.packageService.create(createPackageDto);
  }

  @Get()
  async findAll() {
    return await this.packageService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.packageService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePackageDto: UpdatePackageDto,
  ) {
    return await this.packageService.update(id, updatePackageDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.packageService.remove(id);
  }

  @Post(':id/calculate-price')
  async calculatePrice(
    @Param('id') id: string,
    @Body() calculateDto: CalculatePackagePriceDto,
  ) {
    return await this.packageService.calculatePackagePrice(id, calculateDto);
  }

  @Post(':id/add-service')
  async addService(
    @Param('id') id: string,
    @Body() addServiceDto: AddServiceToPackageDto,
  ) {
    return await this.packageService.addServiceToPackage(id, addServiceDto);
  }

  @Delete(':packageId/services/:serviceId')
  async removeService(
    @Param('packageId') packageId: string,
    @Param('serviceId') serviceId: string,
  ) {
    return await this.packageService.removeServiceFromPackage(
      packageId,
      serviceId,
    );
  }

  @Get(':id/services')
  async getServices(@Param('id') id: string) {
    return await this.packageService.getPackageServices(id);
  }
}
