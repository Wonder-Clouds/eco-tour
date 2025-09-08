import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DetailPrice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float')
  feeSupplier: number;

  @Column('float')
  commissionByService: number;

  @Column('float')
  dollarFee: number;

  @Column('float')
  commissionCard: number;

  @Column('float')
  finalPrice: number;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
