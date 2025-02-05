import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Netmask } from 'netmask';
import { CloudflareService } from '@my/cloudflare';

@Injectable()
export class TelegramGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private cloudflareService: CloudflareService,
  ) {}

  private isIpInSubnetList(ip: string): boolean {
    const subnetList = this.configService.get('telegram.subnetList') as string[];
    const match = subnetList.find(subnet => {
      const block = new Netmask(subnet);
      return block.contains(ip);
    });
    return !!match;
  }

  private isSecretKeyMatch(secretKey: string): boolean {
    if (!this.configService.get('telegram.secretkey')) {
      return true;
    }

    return secretKey === this.configService.get('telegram.secretkey');
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const ip = this.cloudflareService.getVisitorIp();
    const secretKey = request.get('X-Telegram-Bot-Api-Secret-Token');

    return this.isIpInSubnetList(ip) && this.isSecretKeyMatch(secretKey);
  }
}
