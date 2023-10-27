import { Controller, Get } from '@nestjs/common';
import { DevelopersService } from './developers.service';

@Controller('developers')
export class DevelopersController {
  constructor(private readonly developerService: DevelopersService) {}

  @Get()
  async getAll() {
    return this.developerService.findAll();
  }
}
