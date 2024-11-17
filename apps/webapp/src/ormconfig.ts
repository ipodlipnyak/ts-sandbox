/**
 * @see https://stackoverflow.com/a/68154675
 */

/*
import { ConfigModule } from '@nestjs/config';
import db from './src/config/db.config';


ConfigModule.forRoot({
  isGlobal: true,
  load: [db],
});

export default db();
*/

export { dataSource } from './config/db.config';
