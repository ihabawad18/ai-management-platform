import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateConversationDto } from "../dtos/create-conversation.dto";
import { Conversation } from "generated/prisma/client";
import { ConversationRepository } from "../repository/conversation.repository";
import { PaginatedResult } from "src/common/dtos/paginated-result.dto";

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository
  ) {}
  async getAllPaginatedConversationsByAgentConfiguration(
    agentId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResult<Conversation & { lastMessage: string | null }>> {
    // check if agent with the given agentId exists
    const agentExists = await this.conversationRepository.agentExists(agentId);
    if (!agentExists) {
      throw new NotFoundException(
        `Agent not found with the given ID ${agentId}`
      );
    }
    const conversations = this.conversationRepository.findAllByAgentPaginated(
      agentId,
      page,
      pageSize
    );
    return conversations;
  }
  async createNewConversation(
    body: CreateConversationDto
  ): Promise<Conversation> {
    // check if agent with the given agentId exists
    const agentExists = await this.conversationRepository.agentExists(
      body.agentId
    );
    if (!agentExists) {
      throw new NotFoundException(
        `Agent not found with the given ID ${body.agentId}`
      );
    }

    // Create a new conversation
    const conversation = await this.conversationRepository.create({
      agentConfigurationId: body.agentId,
      title: body.title,
    });
    return conversation;
  }
}
