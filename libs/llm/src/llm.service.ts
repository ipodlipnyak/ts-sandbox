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
        @Inject('MY_LLM_OPTIONS') readonly opts: LLMConfig,
    ) {}
    async query(input: GPTApiRequestDTO): Promise<GPTApiResponseDTO> {
        const path = `${this.opts.apiUrl}?text=${input.text}`;
        console.log(path);
        const { data } = await firstValueFrom(
            this.httpService.get<GPTApiResponseDTO>(path).pipe(
                // catchError((error: any) => {
                //     this.logger.error(error.response.data);
                //     throw error;
                // }),
            ),
        );
        return data;
    }
}
