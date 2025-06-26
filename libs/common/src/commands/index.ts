import { CacheClearRunner } from './cache-clear.command';
import { ExtractTokenRunner } from './extract-token.command';
import { GenerateTokenRunner } from './generate-token.command';

export const commands = [GenerateTokenRunner, ExtractTokenRunner, CacheClearRunner];
