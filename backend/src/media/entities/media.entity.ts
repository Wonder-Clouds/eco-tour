import { DetailService } from 'src/detail-service/entities/detail-service.entity';
import { TypeMedia } from 'src/shared/enums/TypeMedia';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TypeMedia })
  type: TypeMedia;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'boolean', default: false })
  isCover: boolean;

  @ManyToOne(() => DetailService, (detailService) => detailService.media)
  @Exclude()
  detailService: DetailService;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
