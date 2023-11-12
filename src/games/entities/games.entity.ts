import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  BaseEntity,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { GameSysReq } from './gameSysReq.entity';
import { Genre } from '../../genres/entities/genre.entity';
import { Developer } from '../../developers/entities/developer.entity';
import { BillingDetails } from '../../billings/entities/billing.entity';
import { Rating } from '../../ratings/entities/rating.entity';
import { SaleDetailsGame } from '../../sales/entities/salePromotion.entity';

@Entity('game')
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'datetime', nullable: false })
  releaseDate: Date;

  @Column({ type: 'int', nullable: false, default: 0 })
  price: number;

  @Column({ type: 'text', nullable: true })
  url: string;

  @ManyToOne(() => Developer, (developer) => developer.games, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn({ name: 'devId' })
  developer: Developer;

  @ManyToMany(() => Genre, (genre) => genre.games, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({ name: 'game_genres' })
  genres: Genre[];

  @OneToMany(() => GameSysReq, (gameSysReq) => gameSysReq.game, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  systemRequirements: GameSysReq[];

  @OneToMany(() => BillingDetails, (billingDetails) => billingDetails.game, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  billingDetails: BillingDetails[];

  @OneToMany(() => Rating, (rating) => rating.game, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  ratings: Rating[];

  @OneToMany(() => SaleDetailsGame, (saleDetailsGame) => saleDetailsGame.game, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  saleDetails: SaleDetailsGame[];
}
