import { Module } from '@nestjs/common';
import { BubblesController } from './bubbles.controller';
import { BubblesService } from './bubbles.service';

@Module({
  imports: [],
  controllers: [BubblesController],
  providers: [BubblesService],
})
export class BubblesModule {}
