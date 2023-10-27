import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { Game } from './games.entity';
import { SysReqTypeEnum } from '../enums/sysreqType.enum';

@Entity('game_sys_req')
export class GameSysReq extends BaseEntity {
  @PrimaryColumn({ type: 'int' })
  gameId: number;

  @PrimaryColumn({ type: 'enum', enum: SysReqTypeEnum })
  reqType: string;

  @Column('int')
  ram: number;

  @Column({ type: 'varchar', length: 100 })
  os: string;

  @Column({ type: 'varchar', length: 100 })
  gpu: string;

  @Column({ type: 'varchar', length: 100 })
  cpu: string;

  @Column('int')
  minStorage: number;

  @ManyToOne(() => Game, (game) => game.id)
  @JoinColumn({ name: 'gameId' })
  game: Game;
}
