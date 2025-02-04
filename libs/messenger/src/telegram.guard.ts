import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Netmask } from 'netmask';

@Injectable()
export class TelegramGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
  ) {}

  private isIpInSubnetList(ip: string): boolean {
    const subnetList = this.configService.get('tg.subnetList') as string[];
    const match = subnetList.find(subnet => {
      const block = new Netmask(subnet);
      return block.contains(ip);
    });
    return !!match;
  }

  private isSecretKeyMatch(secretKey: string): boolean {
    return secretKey === this.configService.get('tg.secretkey');
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const ip = request.ip;
    const secretKey = request.get('X-Telegram-Bot-Api-Secret-Token');

    return this.isIpInSubnetList(ip) && this.isSecretKeyMatch(secretKey);
  }
}
