import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../../../common/repositories/base.repository";
import { PrismaService } from "../../prisma/prisma.service";
import type { Message, Prisma } from "../../../../generated/prisma/client";
import type { PaginatedResult } from "../../../common/dtos/paginated-result.dto";

type MessageDelegate = Prisma.MessageDelegate;

@Injectable()
export class MessageRepository extends BaseRepository<
  Message,
  MessageDelegate
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  protected get model(): MessageDelegate {
    return this.prisma.message;
  }

  async findByConversation(
    conversationId: string,
    params?: { skip?: number; take?: number; takeLast?: number }
  ): Promise<Message[]> {
    if (params?.takeLast) {
      const latestMessages = await this.model.findMany({
        where: { conversationId },
        orderBy: { createdAt: "desc" },
        take: params.takeLast,
      });
      // Return in chronological order for prompt building
      return latestMessages.reverse();
    }

    return super.findAll({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      skip: params?.skip,
      take: params?.take,
    });
  }

  async findPaginatedByConversation(
    conversationId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResult<Message>> {
    return super.findAllWithPagination({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
      page,
      pageSize,
    });
  }
}
