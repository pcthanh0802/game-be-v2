import { Game } from '../../games/entities/games.entity';
import { User } from '../../users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  BaseEntity,
  PrimaryColumn,
} from 'typeorm';

@Entity('billing')
export class Billing extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  timePurchase: Date;

  @Column('int')
  totalCost: number;

  @ManyToOne(() => User, (user) => user.billings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => BillingDetails, (billingDetails) => billingDetails.billing, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  billingDetails: BillingDetails[];
}

@Entity('billing_details')
export class BillingDetails extends BaseEntity {
  @PrimaryColumn()
  billingId: number;

  @PrimaryColumn({ type: 'int' })
  gameId: number;

  @Column('int')
  priceWithDiscount: number;

  @Column({ type: 'char', length: 10 })
  serialKey: string;

  @ManyToOne(() => Billing, (billing) => billing.billingDetails)
  @JoinColumn({ name: 'billingId' })
  billing: Billing;

  @ManyToOne(() => Game, (game) => game.billingDetails, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'gameId' })
  game: Game;
}
