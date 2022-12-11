import { Command, CommandRunner } from 'nest-commander';
import { Logger } from '@nestjs/common';
import { Track } from './../models';
import { FixturesService } from './../services';

@Command({
  name: 'prod-init',
  description: 'initialise application in production environment',
  // arguments: '<task>',
  // options: { isDefault: true }
})
export class ProdInitRunner extends CommandRunner {
  constructor(private fixturesService: FixturesService, private readonly logger: Logger) {
    super();
  }

  async run(
    // inputs: string[],
    // options: Record<string, any>,
  ): Promise<void> {
    const tracks = await Track.find();
    if (tracks.length === 0) {
      await this.fixturesService.loadFixtures('./fixtures/track.yml');
    } else {
      this.logger.verbose('Track table alredy inited. Nothing to add');
    }
  }
}
