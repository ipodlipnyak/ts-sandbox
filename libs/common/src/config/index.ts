// import { isDev } from './environment';

import db from './db.config';
import cache from './cache.config';
import sessions from './sessions.config';
import web from './web.config';
import google from './google.config';
import llm from './llm.config';
import minecraft from './minecraft.config';

export default {
  db,
  sessions,
  cache,
  web,
  google,
  llm,
  minecraft,
};

export const load = [db, sessions, cache, web, google, llm, minecraft];
