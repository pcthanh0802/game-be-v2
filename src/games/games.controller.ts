import { Get, Param, Req, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { GamesService } from './games.service';
import { LessThanOrEqual, Like, MoreThanOrEqual } from 'typeorm';
import { AuthGuard } from '../auth/auth.guard';

@Controller('games')
export class GamesController {
  constructor(private readonly gameService: GamesService) {}

  @Get()
  async find(@Req() req) {
    const { genre, name, page } = req.query;
    const skipAmount = page ? +page * 10 : 0;
    console.log(skipAmount);
    const filterQuery = {};

    if (genre) {
      filterQuery['genres'] = {
        name: genre,
      };
    }
    if (name) {
      filterQuery['name'] = Like(`%${name}%`);
    }

    return await this.gameService.find({
      where: filterQuery,
      relations: {
        genres: true,
        ratings: true,
      },
      skip: skipAmount,
      take: 10,
    });
  }

  @Get('/getGameInfo/:gameId')
  async getGameInfo(@Param('gameId') gameId: number) {
    const currentDate = new Date();
    const res = await this.gameService.findOne({
      where: {
        id: gameId,
      },
      relations: {
        developer: true,
        genres: true,
        ratings: true,
        systemRequirements: true,
      },
    });

    const discount = await this.gameService.findOne({
      select: {
        saleDetails: {
          discountRate: true,
          salePromotion: {
            startDate: true,
            endDate: true,
          },
        },
      },
      where: {
        id: gameId,
        saleDetails: {
          salePromotion: {
            startDate: LessThanOrEqual(currentDate),
            endDate: MoreThanOrEqual(currentDate),
          },
        },
      },
      relations: { saleDetails: { salePromotion: true } },
    });

    if (discount) {
      res.saleDetails = discount.saleDetails;
    }

    return res;
  }

  @Get('gamesOnSale')
  async getGamesOnSale() {
    const currentDate = new Date();
    return await this.gameService.find({
      where: {
        saleDetails: {
          salePromotion: {
            startDate: LessThanOrEqual(currentDate),
            endDate: MoreThanOrEqual(currentDate),
          },
        },
      },
      relations: { saleDetails: { salePromotion: true } },
    });
  }

  @Get('purchasedGames')
  @UseGuards(AuthGuard)
  async getPurchasedGames(@Req() req) {
    const { id } = req['user'];

    return await this.gameService.find({
      where: {
        billingDetails: {
          billing: {
            userId: id,
          },
        },
      },
    });
  }
}
