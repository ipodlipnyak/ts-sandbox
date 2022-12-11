import { Injectable } from '@nestjs/common';

@Injectable()
export class BubblesService {
  getHello(): string {
    return 'Hello World!';
  }
}
