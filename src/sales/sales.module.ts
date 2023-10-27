import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  SaleDetailsGame,
  SalePromotion,
} from './entities/salePromotion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SalePromotion, SaleDetailsGame])],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule {}
