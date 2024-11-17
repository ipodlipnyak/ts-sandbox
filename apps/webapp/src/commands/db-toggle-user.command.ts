import { Command, CommandRunner } from 'nest-commander';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Users } from './../models';

@Command({
  name: 'db-toggle-user',
  description: 'toggle activity for a user by email',
  arguments: '<email>',
  // options: { isDefault: true }
})
export class DbToggleUserRunner extends CommandRunner {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {
    super();
  }

  async run(
    inputs: string[],
    // options: Record<string, any>,
  ): Promise<void> {
    const email = inputs[0];
    const user = await Users.findOne({
      where: {
        email,
      },
    });
    user.active = !user.active;
    await user.save();
  }
}
