import { registerAs } from '@nestjs/config';
import { env } from './environment';
import { entities } from './../models';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

export const options: DataSourceOptions = {
  type: 'postgres',
  name: 'default',
  migrationsTableName: 'migrations',

  logging: true,
  synchronize: false,
  // synchronize: process.env.MODE === "dev",

  host: env.DB_HOST,
  port: parseInt(env.DB_PORT) || 5432,
  username: env.DB_USER || 'bl',
  password: env.DB_PASSWORD || 'bl',
  database: env.DB_DATABASE || 'bl',

  // entities: ['src/**/*.entity.ts'],
  entities,
  // migrations: ['src/migrations/*{.ts,.js}'],
  migrations: [join(__dirname, '../migrations/*.{ts,js}')],
  // subscribers: ['src/subscriber/**/*{.ts,.js}'],
};

export const optionsTest: DataSourceOptions = {
  ...options,
  database: env.DB_DATABASE_TEST || 'bl_test',
};

export const dataSource = new DataSource(options);
export const dataSourceTest = new DataSource(optionsTest);

export default registerAs('db', () => options);

/*
export default registerAs('db', () => {
  return {
    ...options,
    autoLoadEntities: true,
    cli: {
      migrationsDir: 'src/migrations',
    },
  };
});
*/
