import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import {
    Injectable,
    Inject,
    ConsoleLogger,
    OnApplicationShutdown,
    LogLevel,
    Scope,
} from '@nestjs/common';
import { GPTApiResponseDTO, GPTApiRequestDTO, LLMConfig } from './llm.dto';

@Injectable({ scope: Scope.REQUEST })
export class LLMService {
    apiUrl: string

    constructor(
        private readonly httpService: HttpService,
        @Inject('MY_LLM_OPTIONS') readonly opts?: LLMConfig,
    ) {
        if (!(opts && opts.apiUrl)) {
            // console.log('options not found. Did you use LLMModule.forRoot?');
            return;
        }
        this.apiUrl = opts.apiUrl;
    }
    async query(input: GPTApiRequestDTO): Promise<GPTApiResponseDTO> {
        const { data } = await firstValueFrom(
            this.httpService.post<GPTApiResponseDTO>(this.apiUrl, input).pipe(
                // catchError((error: any) => {
                //     this.logger.error(error.response.data);
                //     throw 'An error happened!';
                // }),
            ),
        );
        return data;
    }
}
