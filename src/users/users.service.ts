import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/services/base.service';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly _userRepo: Repository<User>,
  ) {
    super(_userRepo, 'user');
  }
}
