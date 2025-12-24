import { ApiProperty } from "@nestjs/swagger";
import { AgentConfiguration } from "../../../../generated/prisma/client";

export class AgentConfigurationResponseDto {
  @ApiProperty({
    description: "Unique identifier of the agent configuration",
    example: "cfg_123",
  })
  id: string;

  @ApiProperty({
    description: "Human-friendly name of the agent configuration",
    example: "Support Agent",
  })
  name: string;

  @ApiProperty({
    description: "System prompt that guides the agent's behavior",
    example: "You are a concise support assistant.",
  })
  systemPrompt: string;

  @ApiProperty({
    description: "Model identifier used when invoking the agent",
    example: "gpt-4o-mini",
  })
  model: string;

  @ApiProperty({
    description: "Creation timestamp",
    example: "2024-05-01T12:34:56.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Last update timestamp",
    example: "2024-05-02T08:15:30.000Z",
  })
  updatedAt: Date;

  static fromEntity(entity: AgentConfiguration): AgentConfigurationResponseDto {
    const dto = new AgentConfigurationResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.systemPrompt = entity.systemPrompt;
    dto.model = entity.model;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }

  static fromEntities(
    entities: AgentConfiguration[]
  ): AgentConfigurationResponseDto[] {
    return entities.map((entity) =>
      AgentConfigurationResponseDto.fromEntity(entity)
    );
  }
}
