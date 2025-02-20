import { Command, CommandRunner, Option } from 'nest-commander';
import { CryptoService } from '../services';

@Command({
  name: 'token-generate',
  description: 'Generate token from payload',
})
export class GenerateTokenRunner extends CommandRunner {
  constructor(
    private readonly cryptoService: CryptoService,
  ) {
    super();
  }

  async run(
    inputs: string[],
  ): Promise<void> {
    const [payload] = inputs;
    const result = await this.cryptoService.encrypt(payload);
    console.log('YOUR TOKEN HERE >>>>>>>>>>>>>>>>>>>>>>>')
    console.log('');
    console.log(result);
    console.log('');
    console.log('YOUR TOKEN HERE <<<<<<<<<<<<<<<<<<<<<<<')
  }
}
