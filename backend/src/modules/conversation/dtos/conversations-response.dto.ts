import { ApiProperty } from "@nestjs/swagger";
import { PaginatedResult } from "src/common/dtos/paginated-result.dto";
import { ConversationResponseDto } from "./conversation-response.dto";

export class ConversationsResponseDto extends ConversationResponseDto {
  @ApiProperty({
    description: "Content of the most recent message, if any",
    nullable: true,
  })
  lastMessage: string | null;
}

export class ConversationsPaginatedResponseDto {
  @ApiProperty({
    description: "Paginated conversations for the agent",
    type: [ConversationsResponseDto],
  })
  items: ConversationsResponseDto[];
  @ApiProperty({
    description: "Pagination metadata",
    example: { total: 12, totalPages: 2, currentPage: 1, pageSize: 10 },
  })
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };

  static fromEntity(
    entity: PaginatedResult<
      ConversationResponseDto & { lastMessage: string | null }
    >
  ): ConversationsPaginatedResponseDto {
    const dto = new ConversationsPaginatedResponseDto();
    dto.items = entity.items.map((item) => {
      const itemDto = new ConversationsResponseDto();
      itemDto.id = item.id;
      itemDto.agentConfigurationId = item.agentConfigurationId;
      itemDto.title = item.title;
      itemDto.lastMessage = item.lastMessage;
      itemDto.lastMessageAt = item.lastMessageAt;
      itemDto.createdAt = item.createdAt;
      itemDto.updatedAt = item.updatedAt;

      return itemDto;
    });
    dto.meta = entity.meta;
    return dto;
  }
}
