import { Controller, Get } from '@nestjs/common';
import { GenresService } from './genres.service';

@Controller('genres')
export class GenresController {
  constructor(private readonly genreService: GenresService) {}

  @Get()
  async getAll() {
    return await this.genreService.findAll();
  }
}
