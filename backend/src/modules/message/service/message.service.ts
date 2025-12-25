import { Injectable, NotFoundException } from "@nestjs/common";
import { Message, MessageRole } from "../../../../generated/prisma/client";
import { PaginatedResult } from "src/common/dtos/paginated-result.dto";
import { MessageRepository } from "../repository/message.repository";
import { ConversationRepository } from "../../conversation/repository/conversation.repository";
import { LlmService } from "../../llm/service/llm.service";
import { AgentConfigurationsRepository } from "../../agent-configurations/repository/agent-configurations.repository";

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly agentConfigurationsRepository: AgentConfigurationsRepository,
    private readonly llmService: LlmService
  ) {}

  async addNewMessage(params: {
    conversationId: string;
    content: string;
  }): Promise<{ userMessage: Message; assistantMessage: Message }> {
    const conversation = await this.conversationRepository.findById(
      params.conversationId
    );
    if (!conversation) {
      throw new NotFoundException(
        `Conversation not found with id ${params.conversationId}`
      );
    }

    const agent = await this.agentConfigurationsRepository.findById(
      conversation.agentConfigurationId
    );
    if (!agent) {
      throw new NotFoundException(
        `Agent not found with id ${conversation.agentConfigurationId}`
      );
    }

    const userMessage = await this.messageRepository.create({
      conversation: { connect: { id: params.conversationId } },
      role: MessageRole.user,
      content: params.content,
    });

    const history = await this.messageRepository.findByConversation(
      params.conversationId,
      { takeLast: 10 }
    );

    const assistantReply = await this.llmService.generateResponse({
      systemPrompt: agent.systemPrompt,
      userMessage: this.buildPromptFromHistory(history),
      model: agent.model,
    });

    const assistantMessage = await this.messageRepository.create({
      conversation: { connect: { id: params.conversationId } },
      role: MessageRole.assistant,
      content: assistantReply,
    });

    return { userMessage, assistantMessage };
  }

  async getMessagesByConversationId(
    conversationId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResult<Message>> {
    const conversation =
      await this.conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new NotFoundException(
        `Conversation not found with id ${conversationId}`
      );
    }

    return this.messageRepository.findPaginatedByConversation(
      conversationId,
      page,
      pageSize
    );
  }

  private buildPromptFromHistory(messages: Message[]): string {
    return messages.map((m) => `${m.role}: ${m.content}`).join("\n");
  }
}
