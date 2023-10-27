import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { BillingsService } from './billings.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateBillingDto } from './dtos/CreateBilling.dto';
import { makeSerialKey } from '../shared/helpers/serialKeyGenerator';

@Controller('billings')
@UseGuards(AuthGuard)
export class BillingsController {
  constructor(private readonly billingService: BillingsService) {}

  @Post('addBilling')
  async create(@Req() req, @Body() dto: CreateBillingDto) {
    const { id } = req['user'];
    const details = dto.details.map((item) => {
      return { ...item, serialKey: makeSerialKey() };
    });
    const totalCost = details.reduce(
      (acc, cur) => acc + cur.priceWithDiscount,
      0,
    );

    const addObj = this.billingService.create({
      userId: id,
      totalCost: totalCost,
      timePurchase: new Date(),
      billingDetails: details,
    });

    return addObj;
  }

  @Get('allBilling')
  async getBilling(@Req() req) {
    const { id } = req['user'];
    return await this.billingService.find({
      where: { userId: id },
      relations: { billingDetails: { game: true } },
    });
  }
}
