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
    const filterQuery = {};

    if (genre) {
      filterQuery['genres'] = {
        name: genre,
      };
    }
    if (name) {
      filterQuery['name'] = Like(`%${name}%`);
    }

    const findResult = await this.gameService.find({
      where: filterQuery,
      relations: {
        genres: true,
      },
      skip: skipAmount,
      take: 10,
    });

    const discounts = [];
    const currentDate = new Date();
    for (const game of findResult) {
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
          id: game.id,
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
        discounts.push(discount.saleDetails);
      } else {
        discounts.push([]);
      }
    }

    const res = findResult.map((game, index) => {
      return { ...game, saleDetails: discounts[index] };
    });

    return res;
  }

  @Get('/getGameInfo/:gameId')
  async getGameInfo(@Param('gameId') gameId: number) {
    const currentDate = new Date();
    const res = await this.gameService.findOne({
      select: {
        ratings: {
          id: true,
          ratingStar: true,
          comment: true,
          ratingDateTime: true,
          user: { username: true },
        },
      },
      where: {
        id: gameId,
      },
      relations: {
        developer: true,
        genres: true,
        ratings: { user: true },
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
