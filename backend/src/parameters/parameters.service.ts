import { Injectable } from '@nestjs/common';

@Injectable()
export class ParametersService {
  create() {
    return 'This action adds a new parameter';
  }

  findAll() {
    return `This action returns all parameters`;
  }

  findOne(id: number) {
    return `This action returns a #${id} parameter`;
  }

  update(id: number) {
    return `This action updates a #${id} parameter`;
  }

  remove(id: number) {
    return `This action removes a #${id} parameter`;
  }
}
