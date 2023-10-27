import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateRatingDto {
  @IsNumber()
  @Min(0)
  @Max(5)
  ratingStar: number;

  @IsString()
  comment: string;
}
