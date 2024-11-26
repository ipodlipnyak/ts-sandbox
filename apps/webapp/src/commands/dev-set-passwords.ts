import { Command, CommandRunner } from 'nest-commander';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Users } from './../models';

@Command({
  name: 'dev-set-passwords',
  description: 'set same password for every user',
  arguments: '<password>',
  // options: { isDefault: true }
})
export class DevSetPassword extends CommandRunner {
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
    const password = inputs[0];
    const hash = await Users.passwordCalcHash(password);
    await Users.update({}, { password: hash });
    // yeah.. i know. It is bad place for this. By i'm fookinly tired and hungry
    await Users.query('update users set email = lower(email);');
  }
}
