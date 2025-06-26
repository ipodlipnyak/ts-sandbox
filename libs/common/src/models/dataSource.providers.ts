import { Logger, Provider } from "@nestjs/common";
import { options } from "../config/db.config";
import { DI_TOKENS } from "../constants";
import { DataSource } from "typeorm";

const logger = new Logger('DataSourceProviders');

export const dataSourceProvider: Provider[] = [
  {
    provide: DI_TOKENS.DATA_SOURCE.DEFAULT.NAME,
    useFactory: async () => {
        try {
          const dataSource = new DataSource(options);
          await dataSource.initialize();
          logger.log('Database connected')
          return dataSource;
        } catch (error) {
          logger.error('Error connecting to database');
          throw error;
        }
    }
  }
]
