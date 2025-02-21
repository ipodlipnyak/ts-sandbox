import { Command, CommandRunner, Option } from 'nest-commander';
import { TelegramService } from './../telegram.service';

@Command({
  name: 'telegram-commands-list',
  description: 'Get the current list of the bot`s commands for the given scope and user language',
  // arguments: '<email>,<score>,<code>',
  options: { isDefault: true }
})
export class TelegramCommandsListRunner extends CommandRunner {
  constructor(
    private readonly telegramService: TelegramService,
  ) {
    super();
  }

  async run(
    inputs: string[],
    options: Record<string, any>,
  ): Promise<void> {
    const result = await this.telegramService.getMyCommandsList();
    console.log(result);
  }
}
