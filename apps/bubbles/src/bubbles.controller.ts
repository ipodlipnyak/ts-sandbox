import { Controller, Get } from '@nestjs/common';
import { BubblesService } from './bubbles.service';

@Controller()
export class BubblesController {
  constructor(private readonly bubblesService: BubblesService) {}

  @Get()
  getHello(): string {
    return this.bubblesService.getHello();
  }
}
