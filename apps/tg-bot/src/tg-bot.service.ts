import { Injectable } from '@nestjs/common';

@Injectable()
export class TgBotService {
  getHello(): string {
    return 'Hello World!';
  }
}
