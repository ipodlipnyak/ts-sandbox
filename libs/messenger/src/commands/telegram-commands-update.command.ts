import { Command, CommandRunner, Option } from 'nest-commander';
import { TelegramService } from './../telegram.service';

@Command({
  name: 'telegram-commands-update',
  description: 'Update list of the bot`s commands',
  // arguments: '<email>,<score>,<code>',
  options: { isDefault: true }
})
export class TelegramCommandsUpdateRunner extends CommandRunner {
  constructor(
    private readonly telegramService: TelegramService,
  ) {
    super();
  }

  async run(
    inputs: string[],
    options: Record<string, any>,
  ): Promise<void> {
    const result = await this.telegramService.updateBotCommandsList();
    console.log(result);
  }
}
