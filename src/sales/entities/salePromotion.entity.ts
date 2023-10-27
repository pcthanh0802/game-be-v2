import { Game } from 'src/games/entities/games.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';

@Entity('sale_promotion')
export class SalePromotion extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45, nullable: true })
  name: string;

  @Column({ type: 'date', nullable: false })
  startDate: Date;

  @Column({ type: 'date', nullable: false })
  endDate: Date;

  @OneToMany(
    () => SaleDetailsGame,
    (saleDetails) => saleDetails.salePromotion,
    { cascade: true },
  )
  saleDetailsGame: SaleDetailsGame[];
}

@Entity('sale_details_game')
export class SaleDetailsGame {
  @PrimaryColumn({ name: 'saleId' })
  saleId: number;

  @PrimaryColumn({ name: 'gameId' })
  gameId: number;

  @Column({ type: 'int', nullable: false })
  discountRate: number;

  @ManyToOne(() => Game, (game) => game.saleDetails, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'gameId' })
  game: Game;

  @ManyToOne(() => SalePromotion, (sale) => sale.saleDetailsGame, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'saleId' })
  salePromotion: SalePromotion;
}
