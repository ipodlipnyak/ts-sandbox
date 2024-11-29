import { Command, CommandRunner, Option } from 'nest-commander';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Users, TransactionCodeEnum } from './../models';

@Command({
  name: 'db-set-score',
  description: 'add score for a user with specific code',
  arguments: '<email>,<score>,<code>',
  options: { isDefault: true }
})
export class DbSetScoreRunner extends CommandRunner {
  scoreMultiplier: number;

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {
    super();
    this.scoreMultiplier = 1;
  }

  async run(
    inputs: string[],
    options: Record<string, any>,
  ): Promise<void> {
    const [ email, score, code ] = inputs;
    const user = await Users.findOne({
      where: {
        email,
      },
    });
    user.createScoreDelta(Number(score) * this.scoreMultiplier, code);
    await user.save();
  }

  @Option({
    flags: '-n, --negative',
    description: 'Negative score'
  })
  async substruct(
    inputs: string[],
    options: Record<string, any>,
  ) {
    this.scoreMultiplier = -1;
  }
}
