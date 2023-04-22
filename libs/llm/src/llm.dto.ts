import { ApiProperty } from "@nestjs/swagger"

export class LLMConfig {
  apiUrl: string
}

export class GPTApiRequestDTO {
  @ApiProperty({
    example: "What is this context about?",
    description: 'LLM request',
  })
  text: string
}

class GPTApiDocHash { }
class GPTApiNodeInfo { }
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