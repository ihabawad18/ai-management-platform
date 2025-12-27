import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import OpenAI, { APIError } from "openai";
import { mapToOpenAiModel } from "../mappers/llm.mapper";
import { LlmModel } from "generated/prisma/enums";

@Injectable()
export class LlmService {
  constructor(private readonly openAiService: OpenAI) {}

  async generateResponse(params: {
    systemPrompt: string;
    userMessage: string;
    model: LlmModel;
  }): Promise<OpenAI.Responses.Response> {
    try {
      const response = await this.openAiService.responses.create({
        model: mapToOpenAiModel(params.model),
        input: [
          { role: "system", content: params.systemPrompt },
          { role: "user", content: params.userMessage },
        ],
      });

      return response;
    } catch (error: unknown) {
      console.error("OpenAI API error:", error);
      if (error instanceof APIError && error.status === 429) {
        throw new HttpException(
          "AI service is temporarily busy. Please try again.",
          HttpStatus.TOO_MANY_REQUESTS
        );
      } else {
        throw new InternalServerErrorException(
          "Failed to communicate with LLM provider."
        );
      }
    }
  }
}
