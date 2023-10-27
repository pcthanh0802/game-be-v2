import { Injectable } from '@nestjs/common';
import { Developer } from './entities/developer.entity';
import { BaseService } from '../shared/services/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DevelopersService extends BaseService<Developer> {
  constructor(
    @InjectRepository(Developer)
    private readonly _developerRepo: Repository<Developer>,
  ) {
    super(_developerRepo, 'developer');
  }
}
