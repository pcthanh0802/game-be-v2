import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from './entities/rating.entity';
import { RatingsController } from './ratings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Rating])],
  providers: [RatingsService],
  exports: [RatingsService],
  controllers: [RatingsController],
})
export class RatingsModule {}
