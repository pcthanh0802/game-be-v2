import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Game } from './entities/games.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GamesService extends BaseService<Game> {
  constructor(
    @InjectRepository(Game)
    private readonly _gameRepo: Repository<Game>,
  ) {
    super(_gameRepo, 'game');
  }
}
