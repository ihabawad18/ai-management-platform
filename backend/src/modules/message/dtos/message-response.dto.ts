import { ApiProperty } from "@nestjs/swagger";
import { Message } from "../../../../generated/prisma/client";

export class MessageResponseDto {
  @ApiProperty({ description: "Unique identifier of the message" })
  id: string;
  @ApiProperty({ description: "Conversation ID this message belongs to" })
  conversationId: string;
  @ApiProperty({
    description: "Role of the message author",
    example: "user",
  })
  role: string;
  @ApiProperty({ description: "Message content" })
  content: string;
  @ApiProperty({ description: "Creation timestamp of the message" })
  createdAt: Date;

  static fromEntity(entity: Message): MessageResponseDto {
    const dto = new MessageResponseDto();
    dto.id = entity.id;
    dto.conversationId = entity.conversationId;
    dto.role = entity.role;
    dto.content = entity.content;
    dto.createdAt = entity.createdAt;
    return dto;
  }
}
