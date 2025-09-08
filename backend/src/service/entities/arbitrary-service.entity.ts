import { ChildEntity, Column } from 'typeorm';
import { Service } from './service.entity';
import { ServiceType } from '../../shared/enums/ServiceType';

@ChildEntity()
export class ArbitraryService extends Service {
  @Column('float')
  predefinedPrice: number;

  constructor() {
    super();
    this.serviceType = ServiceType.ARBITRARY;
  }

  calculatePrice(): Promise<number> {
    return Promise.resolve(this.predefinedPrice);
  }
}
