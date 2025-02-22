import { Command, CommandRunner, Option } from 'nest-commander';
import { CacheService } from '../services';

@Command({
  name: 'cache-clear',
  description: 'Delete specific or all related keys if no key was passed',
})
export class CacheClearRunner extends CommandRunner {
  constructor(
    private readonly cacheService: CacheService,
  ) {
    super();
  }

  async run(
    inputs: string[],
  ): Promise<void> {
    const [key] = inputs;
    if (key) {
      return await this.cacheService.del(key);
    }

    return await this.cacheService.del();
  }
}
