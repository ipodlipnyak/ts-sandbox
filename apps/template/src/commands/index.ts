export * from './db-reset.command';
export * from './dev-set-passwords';
export * from './prod-init.command';
export * from './db-toggle-user.command';
export * from './db-set-score.command';

import { DBResetRunner } from './db-reset.command';
import { DevSetPassword } from './dev-set-passwords';
import { ProdInitRunner } from './prod-init.command';
import { DbToggleUserRunner } from './db-toggle-user.command';
import { DbSetScoreRunner } from './db-set-score.command';

export const commands = [
  DBResetRunner,
  DevSetPassword,
  ProdInitRunner,
  DbToggleUserRunner,
  DbSetScoreRunner,
];
