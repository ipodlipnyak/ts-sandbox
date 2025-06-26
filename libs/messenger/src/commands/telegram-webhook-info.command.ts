import { Command, CommandRunner, Option } from 'nest-commander';
import { TelegramService } from './../telegram.service';

@Command({
  name: 'webhook-telegram-info',
  description: 'Get telegram webhook status',
  // arguments: '<email>,<score>,<code>',
  options: { isDefault: true }
})
export class TelegramWebhookInfoRunner extends CommandRunner {
  constructor(
    private readonly telegramService: TelegramService,
  ) {
    super();
  }

  async run(
    inputs: string[],
    options: Record<string, any>,
  ): Promise<void> {
    const result = await this.telegramService.getWebhookInfo();
    console.log(result);
  }
}
