import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LlmModel } from "./enums/llm-model.enum";

@Controller("llm")
@ApiTags("LLM")
export class LlmController {
  @Get("models")
  @ApiOperation({ summary: "List supported LLM models" })
  @ApiOkResponse({ description: "Array of available model identifiers", type: [String] })
  getModels(): string[] {
    return Object.values(LlmModel);
  }
}
