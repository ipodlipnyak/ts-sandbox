import * as dotenv from 'dotenv';
import ProcessEnv = NodeJS.ProcessEnv;

dotenv.config();

export const env: ProcessEnv = process.env;
export const isDev = process.env.NODE_ENV !== 'production';
