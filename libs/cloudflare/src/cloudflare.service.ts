import {
    Injectable,
    Inject,
    Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class CloudflareService {
    /**
     * Provides the client IP address connecting to Cloudflare to the origin web server
     * 
     * @see https://developers.cloudflare.com/fundamentals/reference/http-request-headers/#cf-connecting-ip
     */
    CF_CONNECTING_IP = 'CF-Connecting-IP'

    /**
     * Contains a two-character country code of the originating visitor’s country
     *
     * XX - Used for clients without country code data.
     * T1 - Used for clients using the Tor network.
     * 
     * @see https://www.iso.org/iso-3166-country-codes.html 
     * @see https://developers.cloudflare.com/fundamentals/reference/http-request-headers/#cf-ipcountry
     */
    CF_IP_COUNTRY = 'CF-IPCountry'


    constructor(@Inject(REQUEST) private request: Request,) {
        //
    }

    /**
     * Mapped ip is a mix of ipv6 and ipv4.
     * I probably making a crime but i really need 
     * to extract ipv4 from mapped ip.
     * 
     * @param mappedIp ::ffff:127.0.0.1
     * @returns 127.0.0.1
     * 
     * @see https://stackoverflow.com/a/33790357/1168623
     */
    convertMappedIpToIPV4(mappedIp: string): string {
      const re = /\d*\.\d*\.\d*\.\d*/g;
      const ipV4 = re.exec(mappedIp)[0]
      return ipV4;
    }

    /**
     * Get original visitor ip for a client hidden behind cloudflare`s proxies
     * 
     * @returns 123.123.123.123
     */
    getVisitorIp(): string {
        if (this.request.headers.hasOwnProperty(this.CF_CONNECTING_IP.toLowerCase())) {
            return this.request.headers[this.CF_CONNECTING_IP.toLowerCase()] as string;
        }

        return this.convertMappedIpToIPV4(this.request.ip);
    }

    /**
     * Get original visitor country code
     * 
     * @see https://www.iso.org/iso-3166-country-codes.html 
     * @returns US
     */
    getVisitorCountryCode(): string {
        if (this.request.headers.hasOwnProperty(this.CF_IP_COUNTRY.toLowerCase())) {
            return this.request.headers[this.CF_IP_COUNTRY.toLowerCase()] as string;
        }

        return 'XX';
    }
}
