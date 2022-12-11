import { NestFactory } from '@nestjs/core';
import { BubblesModule } from './bubbles.module';

async function bootstrap() {
  const app = await NestFactory.create(BubblesModule);
  await app.listen(3000);
}
bootstrap();
