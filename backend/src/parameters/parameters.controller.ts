import { Controller, Get, Post, Patch, Param, Delete } from '@nestjs/common';
import { ParametersService } from './parameters.service';

@Controller('parameters')
export class ParametersController {
  constructor(private readonly parametersService: ParametersService) {}

  @Post()
  create() {
    return this.parametersService.create();
  }

  @Get()
  findAll() {
    return this.parametersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parametersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.parametersService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parametersService.remove(+id);
  }
}
