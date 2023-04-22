import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { RestResponseDto } from './rest-response.dto';


class LLMResponseDto {
  @ApiProperty({
    example: "\nSorry, I don't understand the question. Could you please rephrase it?", 
    description: 'LLM response',
  })
  response: string;
}

export class LLMQueryReponseDto extends RestResponseDto {
  @ApiProperty({ type: LLMResponseDto, isArray: false, description: 'LLM api response' })
  payload: LLMResponseDto;
}
