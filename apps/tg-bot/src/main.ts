import { NestFactory } from '@nestjs/core';
import { TgBotModule } from './tg-bot.module';

async function bootstrap() {
  const app = await NestFactory.create(TgBotModule);
  await app.listen(3000);
}
bootstrap();
