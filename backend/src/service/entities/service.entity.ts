import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';
import { ServiceType } from '../../shared/enums/ServiceType';
import { DetailService } from '../../detail-service/entities/detail-service.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => DetailService, { cascade: true, eager: true })
  @JoinColumn()
  detailService: DetailService;

  // Simplificamos sin relación directa por ahora
  @Column('float', { default: 0 })
  feeSupplier: number;

  @Column('float', { default: 0 })
  commissionByService: number;

  @Column('float', { default: 0 })
  commissionCard: number;

  @Column('float', { default: 0 })
  finalPrice: number;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: ServiceType,
  })
  serviceType: ServiceType;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  // Método abstracto que debe ser implementado por las clases hijas
  abstract calculatePrice(participants: number, options?: any): Promise<number>;

  // Método común para aplicar ganancia y comisión
  protected applyProfitAndCommission(
    baseAmount: number,
    profitPercentage: number,
    commission: number,
  ): number {
    const withProfit = baseAmount * (1 + profitPercentage / 100);
    return withProfit + commission;
  }
}
