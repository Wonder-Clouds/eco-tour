import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Service } from '../../service/entities/service.entity';
import { DetailService } from '../../detail-service/entities/detail-service.entity';

export interface PackagePricing {
  totalPrice: number;
  discountAmount: number;
  finalPrice: number;
  discountPercentage: number;
  servicesPricing: {
    serviceId: string;
    serviceType: string;
    individualPrice: number;
  }[];
  participants: number;
}

@Entity()
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column('float', { default: 0 })
  discountPercentage: number; // Descuento por paquete

  @Column('int', { default: 30 })
  validityDays: number; // Días de validez del paquete

  @Column({ default: true })
  isActive: boolean;

  // Relación Many-to-Many con Services
  @ManyToMany(() => Service, { cascade: true, eager: true })
  @JoinTable({
    name: 'package_services',
    joinColumn: { name: 'package_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' },
  })
  services: Service[];

  // Información detallada del paquete
  @OneToOne(() => DetailService, { cascade: true, eager: true })
  @JoinColumn()
  detailService: DetailService;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Método para calcular precio total del paquete
  async calculateTotalPrice(
    participants: number,
    options?: any,
  ): Promise<PackagePricing> {
    let totalPrice = 0;
    const servicesPricing: {
      serviceId: string;
      serviceType: string;
      individualPrice: number;
    }[] = [];

    for (const service of this.services) {
      const servicePrice = await service.calculatePrice(participants, options);
      servicesPricing.push({
        serviceId: service.id,
        serviceType: service.constructor.name,
        individualPrice: servicePrice,
      });
      totalPrice += servicePrice;
    }

    const discountAmount = totalPrice * (this.discountPercentage / 100);
    const finalPrice = totalPrice - discountAmount;

    return {
      totalPrice,
      discountAmount,
      finalPrice,
      discountPercentage: this.discountPercentage,
      servicesPricing,
      participants,
    };
  }
}
