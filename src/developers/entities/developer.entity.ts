import { Game } from '../../games/entities/games.entity';
import { Entity, PrimaryColumn, Column, OneToMany, BaseEntity } from 'typeorm';

@Entity('developer')
export class Developer extends BaseEntity {
  @PrimaryColumn({ type: 'char', length: 8 })
  id: string;

  @Column({ type: 'varchar', length: 45 })
  name: string;

  @Column({ type: 'varchar', length: 45 })
  country: string;

  @OneToMany(() => Game, (game) => game.developer, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  games: Game[];
}
