import { ApiProperty } from "@nestjs/swagger";
import { Conversation } from "generated/prisma/client";

export class ConversationResponseDto {
  @ApiProperty({ description: "Unique identifier of the conversation" })
  id: string;
  @ApiProperty({
    description: "Agent configuration linked to this conversation",
  })
  agentConfigurationId: string;
  @ApiProperty({ description: "Title of the conversation" })
  title: string;
  @ApiProperty({
    description: "Timestamp of the last message in this conversation",
    nullable: true,
  })
  lastMessageAt: Date | null;
  @ApiProperty({ description: "Creation timestamp" })
  createdAt: Date;
  @ApiProperty({ description: "Last update timestamp" })
  updatedAt: Date;

  static fromEntity(entity: Conversation): ConversationResponseDto {
    const dto = new ConversationResponseDto();
    dto.id = entity.id;
    dto.agentConfigurationId = entity.agentConfigurationId;
    dto.title = entity.title;
    dto.lastMessageAt = entity.lastMessageAt;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
