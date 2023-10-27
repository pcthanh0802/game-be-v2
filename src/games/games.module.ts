import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/games.entity';
import { GameSysReq } from './entities/gameSysReq.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, GameSysReq])],
  providers: [GamesService],
  controllers: [GamesController],
})
export class GamesModule {}
