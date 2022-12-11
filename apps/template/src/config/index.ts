// import { isDev } from './environment';

import db from './db.config';
import cache from './cache.config';
import sessions from './sessions.config';
import web from './web.config';

export default {
  db,
  sessions,
  cache,
  web,
};

export const load = [db, sessions, cache, web];
