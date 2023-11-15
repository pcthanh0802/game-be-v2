import { Get, Post, Param, Req, UseGuards, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { GamesService } from './games.service';
import { LessThanOrEqual, Like, MoreThanOrEqual } from 'typeorm';
import { AuthGuard } from '../auth/auth.guard';
import {
  UploadGameDto,
} from './dtos/game.request.dto';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
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

    const s3 = new S3Client({
      apiVersion: '2006-03-01',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION,
    });

    const thumbnailUrls = await Promise.all(
      findResult.map(item => {
        if (item.thumbnailUrl) {
          const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: item.thumbnailUrl,
          };

          const command = new GetObjectCommand(params);
          return getSignedUrl(s3, command, { expiresIn: 3600 });
        }
        return null;
      })
    );

    const res = findResult.map((game, index) => {
      return {
        ...game,
        saleDetails: discounts[index],
        thumbnailUrl: thumbnailUrls[index],
      };
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

    const s3 = new S3Client({
      apiVersion: '2006-03-01',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION,
    });

    if (res?.thumbnailUrl) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: res.thumbnailUrl,
      };

      const command = new GetObjectCommand(params);
      res.thumbnailUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    }

    if (res?.gameUrl) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: res.gameUrl,
      };

      const command = new GetObjectCommand(params);
      res.gameUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
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

    const gameObjectKey = 'games/' + uploadGameDto['name'].replaceAll(' ', '-') + uploadGameDto['gameExtension'];
    const thumnailObjectKey = 'thumbnails/' + uploadGameDto['name'].replaceAll(' ', '-') + uploadGameDto['thumbnailExtension'];
    const gameContentType = uploadGameDto['gameContentType'];
    const thumnailContentType = uploadGameDto['thumbnailContentType'];

    const game = {
      name: uploadGameDto.name,
      description: uploadGameDto.description,
      price: uploadGameDto.price,
      developer: id || 1,
      releaseDate: new Date(),
      gameUrl: gameObjectKey,
      thumbnailUrl: thumnailObjectKey,
    };

    const insertObj = await this.gameService.create({
      ...game,
      developer: 1,
    });

    // Set the expiration time for the pre-signed URL (in seconds)
    const expiresIn = 3600; // 1 hour
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: gameObjectKey,
      ContentType: gameContentType,
    };

    const uploadThumbnailParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: thumnailObjectKey,
      ContentType: thumnailContentType,
    };

    const command = new PutObjectCommand(params);
    const uploadThumbnailCommand = new PutObjectCommand(uploadThumbnailParams);

    const uploadGameurl = await getSignedUrl(s3, command, { expiresIn });
    const uploadThumbnailUrl = await getSignedUrl(s3, uploadThumbnailCommand, { expiresIn });

    return {
      ...insertObj,
      uploadGameurl,
      uploadThumbnailUrl,
    };
  }
}
