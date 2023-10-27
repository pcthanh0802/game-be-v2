import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Rating } from './entities/rating.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RatingsService extends BaseService<Rating> {
  constructor(
    @InjectRepository(Rating)
    private readonly _ratingRepo: Repository<Rating>,
  ) {
    super(_ratingRepo, 'rating');
  }
}
