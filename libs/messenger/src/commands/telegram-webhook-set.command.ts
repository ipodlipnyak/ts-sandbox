import { Command, CommandRunner, Option } from 'nest-commander';
import { TelegramService } from './../telegram.service';

@Command({
  name: 'webhook-telegram-set',
  description: 'Set telegram webhooks',
  arguments: '<url>,<secret>',
  options: { isDefault: true }
})
export class TelegramWebhookSetRunner extends CommandRunner {
  constructor(
    private readonly telegramService: TelegramService,
  ) {
    super();
  }

  async run(
    inputs: string[],
    options: Record<string, any>,
  ): Promise<void> {
    const [ url, secret ] = inputs;
    const response = await this.telegramService.setWebhook(url, secret);
    console.log(response);
  }
}
