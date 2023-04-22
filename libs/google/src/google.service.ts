import {
    Injectable,
    Inject,
    ConsoleLogger,
    OnApplicationShutdown,
    LogLevel,
    Scope,
} from '@nestjs/common';
import { OAuth2Client, OAuth2ClientOptions } from 'google-auth-library';

@Injectable({ scope: Scope.REQUEST })
export class GoogleService {
    private client: OAuth2Client;

    constructor(@Inject('MY_GOOGLE_OPTIONS') readonly opts?: OAuth2ClientOptions) {
        if (!(opts && opts.clientId)) {
            // console.log('options not found. Did you use GoogleModule.forRoot?');
            return;
        }
        this.client = new OAuth2Client(opts);
    }

    get ClientInstance() {
        return this.client;
    }
    
    get ClientId() {
        return this.client._clientId;
    }
}
