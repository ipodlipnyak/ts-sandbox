import { Logger, Injectable } from '@nestjs/common';
import * as path from 'path';
import { Builder, fixturesIterator, Loader, Parser, Resolver } from 'typeorm-fixtures-cli/dist';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class FixturesService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private readonly logger: Logger,
  ) { }

  async loadFixtures(fixturesPath: string) {
    try {
      const dataSource = this.dataSource;

      const loader = new Loader();
      loader.load(path.resolve(fixturesPath));

      const resolver = new Resolver();
      const fixtures = resolver.resolve(loader.fixtureConfigs);
      const builder = new Builder(dataSource, new Parser(), false);

      for (const fixture of fixturesIterator(fixtures)) {
        const entity: any = await builder.build(fixture);
        await dataSource.getRepository(fixture.entity).save(entity);
      }
      this.logger.verbose(`Fixtures from ${fixturesPath} uploaded`);
    } catch (err) {
      this.logger.error(err);
      // throw err;
    }
  }
}
