import { registerAs } from '@nestjs/config';
import { env } from './environment';

export default registerAs('llm', () => {
  return {
    apiUrl: env.LLM_API_URL || '',
  };
});
