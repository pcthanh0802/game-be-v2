import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/services/base.service';
import { Genre } from './entities/genre.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GenresService extends BaseService<Genre> {
  constructor(
    @InjectRepository(Genre)
    private readonly _genreRepo: Repository<Genre>,
  ) {
    super(_genreRepo, 'genre');
  }
}
