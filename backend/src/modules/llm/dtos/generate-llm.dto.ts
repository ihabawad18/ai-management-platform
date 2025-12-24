import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { LlmModel } from "../enums/llm-model.enum";

export class GenerateLlmDto {
  @ApiProperty({
    description: "System prompt that defines agent behavior",
    example: "You are a helpful assistant",
  })
  @IsString()
  @IsNotEmpty()
  systemPrompt: string;

  @ApiProperty({
    description: "User input message",
    example: "Explain SSE in simple terms",
  })
  @IsString()
  @IsNotEmpty()
  userMessage: string;

  @ApiProperty({
    enum: LlmModel,
    example: LlmModel.GPT_5_2,
  })
  @IsEnum(LlmModel)
  model: LlmModel;
}
