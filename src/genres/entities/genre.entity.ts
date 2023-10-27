import { Game } from 'src/games/entities/games.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
} from 'typeorm';

@Entity('genre')
export class Genre extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 45 })
  name: string;

  @ManyToMany(() => Game, (game) => game.genres, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  games: Game[];
}
