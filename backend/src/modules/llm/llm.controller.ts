import { Body, Controller, Post } from "@nestjs/common";
import { LlmService } from "./service/llm.service";
import { GenerateLlmDto } from "./dtos/generate-llm.dto";

@Controller("llm")
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post("generate")
  async generate(@Body() body: GenerateLlmDto) {
    const response = await this.llmService.generateResponse(body);

    return response;
  }
}
