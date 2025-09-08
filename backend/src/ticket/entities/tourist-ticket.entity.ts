import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class TouristTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('float')
  basePrice: number;

  @Column('float', { default: 0 })
  studentDiscount: number;

  @Column('float', { default: 0 })
  childDiscount: number;

  @Column('float', { default: 0 })
  nationalDiscount: number;

  @Column({ default: false })
  requiresPassport: boolean;

  @Column({ default: true })
  onlineAvailable: boolean;

  @ManyToOne('PrivateService', 'touristTickets')
  service: any;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  calculateCost(
    totalPeople: number,
    students: number = 0,
    children: number = 0,
    nationals: number = 0,
  ): number {
    const regularPeople = totalPeople - students - children - nationals;

    let totalCost = 0;
    totalCost += regularPeople * this.basePrice;
    totalCost += students * this.basePrice * (1 - this.studentDiscount / 100);
    totalCost += children * this.basePrice * (1 - this.childDiscount / 100);
    totalCost += nationals * this.basePrice * (1 - this.nationalDiscount / 100);

    return totalCost;
  }
}
