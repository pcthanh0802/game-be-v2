import { Get, Post, Param, Req, UseGuards, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { GamesService } from './games.service';
import { LessThanOrEqual, Like, MoreThanOrEqual } from 'typeorm';
import { AuthGuard } from '../auth/auth.guard';
import {
  UploadGameDto,
} from './dtos/game.request.dto';
import { S3Client,  PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


@Controller('games')
export class GamesController {
  constructor(private readonly gameService: GamesService) {}

  @Get()
  async find(@Req() req) {
    const { genre, name, page } = req.query;
    const skipAmount = page ? +page * 27 : 0;
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
      take: 27,
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

  @HttpCode(HttpStatus.CREATED)
  @Post('uploadGame')
  async uploadGame(
    @Req() req,
    @Body() uploadGameDto: UploadGameDto,
  ) {
    const { id = 1 } = req['user'] || {};
    const s3 = new S3Client({
      apiVersion: '2006-03-01',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION,
    });

    const objectKey = 'games/' + uploadGameDto['name'].replaceAll(' ', '-') + uploadGameDto['fileExtension'];
    const ContentType = uploadGameDto['contentType']

    // Set the expiration time for the pre-signed URL (in seconds)
    const expiresIn = 30; // 1 hour
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: objectKey,
      ContentType,
    };
    const command = new PutObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn });

    const game = {
      name: uploadGameDto.name,
      description: uploadGameDto.description,
      price: uploadGameDto.price,
      dev: id,
      releaseDate: new Date(),
      url: objectKey,
    };

    const insertObj = await this.gameService.create(game);

    return {
      ...insertObj,
      uploadUrl: url,
    };
  }
}
