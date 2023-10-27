import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { SalePromotion } from './entities/salePromotion.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SalesService extends BaseService<SalePromotion> {
  constructor(
    @InjectRepository(SalePromotion)
    private readonly _saleRepo: Repository<SalePromotion>,
  ) {
    super(_saleRepo, 'sale promotion');
  }
}
