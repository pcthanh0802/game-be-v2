import { Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { GenresController } from './genres.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Genre])],
  providers: [GenresService],
  controllers: [GenresController],
})
export class GenresModule {}
