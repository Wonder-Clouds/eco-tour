import { ChildEntity } from 'typeorm';
import { Service } from './service.entity';
import { ServiceType } from '../../shared/enums/ServiceType';

@ChildEntity()
export class GroupService extends Service {
  constructor() {
    super();
    this.serviceType = ServiceType.GROUP;
  }

  calculatePrice(participants: number): Promise<number> {
    const basePrice = this.feeSupplier || 0;
    const totalBase = basePrice * participants;

    const finalPrice = this.applyProfitAndCommission(
      totalBase,
      this.commissionByService || 0,
      this.commissionCard || 0,
    );

    return Promise.resolve(finalPrice);
  }
}
