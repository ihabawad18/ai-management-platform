import { Injectable, InternalServerErrorException } from "@nestjs/common";
import OpenAI from "openai";
import { mapToOpenAiModel } from "../mappers/llm.mapper";
import { LlmModel } from "generated/prisma/enums";

@Injectable()
export class LlmService {
  constructor(private readonly openAiService: OpenAI) {}

  async generateResponse(params: {
    systemPrompt: string;
    userMessage: string;
    model: LlmModel;
  }): Promise<string> {
    try {
      const response = await this.openAiService.responses.create({
        model: mapToOpenAiModel(params.model),
        input: [
          { role: "system", content: params.systemPrompt },
          { role: "user", content: params.userMessage },
        ],
      });

      return response.output_text ?? "";
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new InternalServerErrorException(
        "Failed to communicate with LLM provider."
      );
    }
  }
}
