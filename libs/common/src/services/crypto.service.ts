
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, scryptSync } from 'crypto';

@Injectable()
export class CryptoService {
  private readonly logger = new Logger(CryptoService.name);

  constructor(
    private configService: ConfigService,
  ) {}


  get cryptoInitVector() {
    return Buffer.alloc(16, 0);
  }

  get cryptoKey() {
    const secret = this.configService.get('sessions.secret');
    return scryptSync(secret, 'salt', 24);
  }

  get cryptoMethod() {
    return 'aes-192-cbc';
  }

  async encrypt(payload: string) {
    const key = this.cryptoKey;
    const iv = this.cryptoInitVector;

    const cipher = createCipheriv(this.cryptoMethod, key, iv);
    const encryptedText = Buffer.from(
      cipher.update(payload, 'utf-8', 'hex') + cipher.final('hex')
    ).toString('base64');

    return encryptedText;
  }

  async decrypt(encryptedData: string) {
    const secret = this.configService.get('session.secret');
    const key = this.cryptoKey;
    const iv = this.cryptoInitVector;

    const buff = Buffer.from(encryptedData, 'base64')
    const decipher = createDecipheriv(this.cryptoMethod, key, iv)
    return (
      decipher.update(buff.toString('utf8'), 'hex', 'utf8') + decipher.final('utf8')
    );
  }

}
