import { ApiProperty } from "@nestjs/swagger";
import { Message } from "../../../../generated/prisma/client";
import { MessageResponseDto } from "./message-response.dto";

export class SendMessageResponseDto {
  @ApiProperty({
    description: "The user message and the generated assistant reply",
    type: [MessageResponseDto],
  })
  messages: [MessageResponseDto, MessageResponseDto];

  static fromEntities(
    userMessage: Message,
    assistantMessage: Message
  ): SendMessageResponseDto {
    const dto = new SendMessageResponseDto();
    dto.messages = [
      MessageResponseDto.fromEntity(userMessage),
      MessageResponseDto.fromEntity(assistantMessage),
    ];
    return dto;
  }
}
