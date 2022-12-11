import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseStringPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const val = value?.trim();
    if (!val) {
      throw new BadRequestException('String validation failed');
    }
    return val;
  }
}
