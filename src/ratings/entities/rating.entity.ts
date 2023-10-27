import { Game } from 'src/games/entities/games.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';

@Entity('rating')
export class Rating extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  ratingStar: number;

  @Column({ type: 'text', nullable: false })
  comment: string;

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  ratingDateTime: Date;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'int' })
  gameId: number;

  @ManyToOne(() => User, (user) => user.ratings, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Game, (game) => game.ratings, { nullable: false })
  @JoinColumn({ name: 'gameId' })
  game: Game;
}
