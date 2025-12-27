import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../../../common/repositories/base.repository";
import { PrismaService } from "../../prisma/prisma.service";
import type { Conversation, Prisma } from "../../../../generated/prisma/client";
import type { PaginatedResult } from "../../../common/dtos/paginated-result.dto";

type ConversationDelegate = Prisma.ConversationDelegate;

type ConversationWithMessages = Conversation & {
  messages?: { content: string }[];
};
@Injectable()
export class ConversationRepository extends BaseRepository<
  Conversation,
  ConversationDelegate
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  protected get model(): ConversationDelegate {
    return this.prisma.conversation;
  }

  async findAllByAgentPaginated(
    agentConfigurationId: string,
    page: number,
    pageSize: number
  ): Promise<PaginatedResult<Conversation & { lastMessage: string | null }>> {
    const result = await super.findAllWithPagination({
      where: { agentConfigurationId },
      page,
      pageSize,
      orderBy: [
        { lastMessageAt: { sort: "desc", nulls: "last" } },
        { createdAt: "desc" },
      ],
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { content: true },
        },
      },
    });

    const itemsWithLastMessage = result.items.map((conversation) => {
      const convo = conversation as ConversationWithMessages;
      const lastMessage =
        Array.isArray(convo.messages) &&
        typeof convo.messages[0]?.content === "string"
          ? convo.messages[0].content
          : null;
      const { ...rest } = convo;
      return { ...rest, lastMessage };
    });

    return {
      items: itemsWithLastMessage,
      meta: result.meta,
    };
  }

  async agentExists(agentConfigurationId: string): Promise<boolean> {
    const count = await this.prisma.agentConfiguration.count({
      where: { id: agentConfigurationId },
    });
    return count > 0;
  }

  async updateLastMessageAt(
    conversationId: string,
    lastMessageAt: Date
  ): Promise<void> {
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt },
    });
  }
}
