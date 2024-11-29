import { Command, CommandRunner } from 'nest-commander';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Command({
  name: 'db-reset',
  description: 'clean database of its content and rerun all migrations',
  // arguments: '<task>',
  // options: { isDefault: true }
})
export class DBResetRunner extends CommandRunner {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {
    super();
  }
  async run(
    // inputs: string[],
    // options: Record<string, any>,
  ): Promise<void> {
    await this.dataSource.dropDatabase();
    await this.dataSource.runMigrations();
  }
}
