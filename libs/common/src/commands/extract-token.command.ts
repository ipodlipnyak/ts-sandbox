import { Command, CommandRunner, Option } from 'nest-commander';
import { CryptoService } from '../services';

@Command({
  name: 'token-extract',
  description: 'Extract payload from token',
})
export class ExtractTokenRunner extends CommandRunner {
  constructor(
    private readonly cryptoService: CryptoService,
  ) {
    super();
  }

  async run(
    inputs: string[],
  ): Promise<void> {
    const [token] = inputs;
    const result = await this.cryptoService.decrypt(token);
    console.log('YOUR PAYLOAD HERE >>>>>>>>>>>>>>>>>>>>>>>')
    console.log('');
    console.log(result);
    console.log('');
    console.log('YOUR PAYLOAD HERE <<<<<<<<<<<<<<<<<<<<<<<')
  }
}
