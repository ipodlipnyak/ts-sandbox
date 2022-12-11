import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseEmailPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const val = value?.trim()?.toLowerCase();
    const isItEmail = /.+@.+\..+/.test(val);
    if (!val || !isItEmail) {
      throw new BadRequestException('Email validation failed');
    }
    return val;
  }
}
