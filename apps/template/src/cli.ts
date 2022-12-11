import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

/**
 * Command line interface, that gonna die on command completion
 * Commands stored inside `/src/commands` folder
 * Use as `npm run cli some-command-name`
 * For commands list run `npm run cli -- --help`
 * @see https://docs.nestjs.com/standalone-applications
 * @see https://nest-commander.jaymcdoniel.dev/docs/
 * @see https://docs.nestjs.com/recipes/nest-commander
 */
async function bootstrap() {
  await CommandFactory.run(AppModule, new Logger());
  process.exit();
}

bootstrap();
