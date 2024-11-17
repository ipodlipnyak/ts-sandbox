import { registerAs } from '@nestjs/config';
import { env } from './environment';

export default registerAs('minecraft', () => {
  return {
    statusUrl: env.MINECRAFT_STATUS_URL || '',
    startUrl: env.MINECRAFT_START_URL || '',
    stopUrl: env.MINECRAFT_STOP_URL || '',
  };
});
