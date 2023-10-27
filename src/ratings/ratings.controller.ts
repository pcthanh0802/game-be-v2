import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateRatingDto } from './dtos/CreateRating.dto';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingService: RatingsService) {}

  @Post('/:gameId')
  @UseGuards(AuthGuard)
  async create(
    @Req() req,
    @Param('gameId') gameId: number,
    @Body() createRatingDto: CreateRatingDto,
  ) {
    const { id } = req['user'];

    return await this.ratingService.create({
      ...createRatingDto,
      gameId: gameId,
      userId: id,
    });
  }
}
