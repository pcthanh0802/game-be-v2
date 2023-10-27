import { Billing } from '../../billings/entities/billing.entity';
import { Rating } from '../../ratings/entities/rating.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  BaseEntity,
  OneToMany,
} from 'typeorm';

@Entity('user')
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45, nullable: false })
  fullName: string;

  @Column({ length: 45, nullable: false })
  email: string;

  @Column({ length: 20, nullable: false })
  username: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @OneToMany(() => Billing, (billing) => billing.user, { cascade: true })
  billings: Billing[];

  @OneToMany(() => Rating, (rating) => rating.user, { cascade: true })
  ratings: Rating[];
}
