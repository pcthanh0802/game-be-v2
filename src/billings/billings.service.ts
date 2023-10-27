import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/services/base.service';
import { Billing } from './entities/billing.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BillingsService extends BaseService<Billing> {
  constructor(
    @InjectRepository(Billing)
    private readonly _billingRepo: Repository<Billing>,
  ) {
    super(_billingRepo, 'billing');
  }
}
