import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { RestResponseDto } from './rest-response.dto';

export class GPTApiRequestDTO {
  query: string
}
class GPTApiDocHash {}
class GPTApiNodeInfo {}
class GPTApiSourceNodeDTO {
  doc_hash: GPTApiDocHash
  node_info: GPTApiNodeInfo
  /** @example 1: "387af75e-2949-4811-a7d6-18fa9e99e260" */
  relationships: any
  text: string
}
class GPTApiSourceNodesDTO {
  node: GPTApiSourceNodeDTO
}
export class GPTApiResponseDTO {
  /** @example 51a02328-c40a-439d-ab6e-fa6343756f89:	null */
  extra_info: any
  response: string
  source_nodes: GPTApiSourceNodesDTO[]
}

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
