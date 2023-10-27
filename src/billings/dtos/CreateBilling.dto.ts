export class CreateBillingDto {
  details: IBillingDetails[];
}

export interface IBillingDetails {
  gameId: number;
  priceWithDiscount: number;
}
