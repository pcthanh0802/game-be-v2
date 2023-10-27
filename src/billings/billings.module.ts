import { Module } from '@nestjs/common';
import { BillingsService } from './billings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Billing, BillingDetails } from './entities/billing.entity';
import { BillingsController } from './billings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Billing, BillingDetails])],
  providers: [BillingsService],
  exports: [BillingsService],
  controllers: [BillingsController],
})
export class BillingsModule {}
