import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { LlmModel } from "generated/prisma/enums";

export class CreateAgentConfigurationDto {
  @ApiProperty({
    description: "Human-friendly name of the agent configuration",
    example: "Support Agent",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "System prompt that guides the agent's behavior",
    example: "You are a concise support assistant.",
  })
  @IsString()
  @IsNotEmpty()
  systemPrompt: string;

  @ApiProperty({
    description: "Model identifier used when invoking the agent",
    example: "GPT_5_2",
  })
  @IsEnum(LlmModel)
  model: LlmModel;
}
