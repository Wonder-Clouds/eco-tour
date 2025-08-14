import { Datum } from 'src/data/entities/datum.entity';
import { Itinerary } from 'src/itinerary/entities/itinerary.entity';
import { Media } from 'src/media/entities/media.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DetailService {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  duration: string;

  @OneToMany(() => Datum, (datum) => datum.detailService, {
    cascade: true,
    eager: true,
  })
  data: Datum[];

  @Column({ type: 'text' })
  sumary: string;

  @Column({ type: 'text' })
  includes: string;

  @Column({ type: 'text' })
  notIncludes: string;

  @OneToMany(() => Itinerary, (itinerary) => itinerary.detailService, {
    cascade: true,
    eager: true,
  })
  itinerary: Itinerary[];

  @OneToMany(() => Media, (media) => media.detailService, {
    cascade: true,
    eager: true,
  })
  media: Media[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
