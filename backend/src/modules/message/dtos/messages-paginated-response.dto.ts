import { ApiProperty } from "@nestjs/swagger";
import { PaginatedResult } from "src/common/dtos/paginated-result.dto";
import { Message } from "../../../../generated/prisma/client";
import { MessageResponseDto } from "./message-response.dto";

export class MessagesPaginatedResponseDto {
  @ApiProperty({
    description: "Paginated messages",
    type: [MessageResponseDto],
  })
  items: MessageResponseDto[];
  @ApiProperty({
    description: "Pagination metadata",
    example: {
      total: 42,
      totalPages: 5,
      currentPage: 1,
      pageSize: 10,
    },
  })
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };

  static fromEntity(entity: PaginatedResult<Message>): MessagesPaginatedResponseDto {
    const dto = new MessagesPaginatedResponseDto();
    dto.items = entity.items.map((item) => MessageResponseDto.fromEntity(item));
    dto.meta = entity.meta;
    return dto;
  }
}
