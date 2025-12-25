/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { NotFoundException } from "@nestjs/common";
import { MessageRole } from "../../../../generated/prisma/client";
import { LlmModel } from "../../../../generated/prisma/enums";
import { MessageService } from "./message.service";
import type { MessageRepository } from "../repository/message.repository";
import type { ConversationRepository } from "../../conversation/repository/conversation.repository";
import type { AgentConfigurationsRepository } from "../../agent-configurations/repository/agent-configurations.repository";
import type { LlmService } from "../../llm/service/llm.service";
import type { UsageMetricsService } from "../../metrics/service/usage-metrics.service";

describe("MessageService", () => {
  type WithoutThis<T> = T extends (this: any, ...args: infer A) => infer R
    ? (...args: A) => R
    : T;
  const createMockFn = <T extends (...args: unknown[]) => unknown>() =>
    jest.fn<ReturnType<T>, Parameters<T>, void>();

  const messageRepository: {
    create: jest.MockedFunction<WithoutThis<MessageRepository["create"]>>;
    findByConversation: jest.MockedFunction<
      WithoutThis<MessageRepository["findByConversation"]>
    >;
    findPaginatedByConversation: jest.MockedFunction<
      WithoutThis<MessageRepository["findPaginatedByConversation"]>
    >;
  } = {
    create: createMockFn<WithoutThis<MessageRepository["create"]>>(),
    findByConversation:
      createMockFn<WithoutThis<MessageRepository["findByConversation"]>>(),
    findPaginatedByConversation:
      createMockFn<
        WithoutThis<MessageRepository["findPaginatedByConversation"]>
      >(),
  };
  const conversationRepository: {
    findById: jest.MockedFunction<
      WithoutThis<ConversationRepository["findById"]>
    >;
  } = {
    findById: createMockFn<WithoutThis<ConversationRepository["findById"]>>(),
  };
  const agentConfigurationsRepository: {
    findById: jest.MockedFunction<
      WithoutThis<AgentConfigurationsRepository["findById"]>
    >;
  } = {
    findById:
      createMockFn<WithoutThis<AgentConfigurationsRepository["findById"]>>(),
  };
  const llmService: {
    generateResponse: jest.MockedFunction<
      WithoutThis<LlmService["generateResponse"]>
    >;
  } = {
    generateResponse:
      createMockFn<WithoutThis<LlmService["generateResponse"]>>(),
  };
  const usageMetricsService: {
    recordInteraction: jest.MockedFunction<
      WithoutThis<UsageMetricsService["recordInteraction"]>
    >;
  } = {
    recordInteraction:
      createMockFn<WithoutThis<UsageMetricsService["recordInteraction"]>>(),
  };

  let service: MessageService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MessageService(
      messageRepository as any,
      conversationRepository as any,
      agentConfigurationsRepository as any,
      llmService as any,
      usageMetricsService as any
    );
  });

  it("throws NotFoundException when conversation is missing on addNewMessage", async () => {
    conversationRepository.findById.mockResolvedValue(null);

    await expect(
      service.addNewMessage({ conversationId: "c1", content: "hi" })
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("creates user and assistant messages and returns them", async () => {
    conversationRepository.findById.mockResolvedValue({
      id: "c1",
      agentConfigurationId: "a1",
    } as any);
    agentConfigurationsRepository.findById.mockResolvedValue({
      id: "a1",
      systemPrompt: "You are helpful",
      model: LlmModel.GPT_5_2,
    } as any);
    messageRepository.create
      .mockResolvedValueOnce({ id: "m-user", role: MessageRole.user } as any)
      .mockResolvedValueOnce({
        id: "m-assistant",
        role: MessageRole.assistant,
      } as any);
    messageRepository.findByConversation.mockResolvedValue([
      { role: MessageRole.user, content: "hello" } as any,
    ]);
    llmService.generateResponse.mockResolvedValue({
      output_text: "assistant reply",
      usage: { total_tokens: 42 },
    } as any);

    const result = await service.addNewMessage({
      conversationId: "c1",
      content: "hi",
    });

    expect(messageRepository.create).toHaveBeenNthCalledWith(1, {
      conversation: { connect: { id: "c1" } },
      role: MessageRole.user,
      content: "hi",
    });
    expect(messageRepository.findByConversation).toHaveBeenCalledWith("c1", {
      takeLast: 10,
    });
    expect(llmService.generateResponse).toHaveBeenCalledWith({
      systemPrompt: "You are helpful",
      userMessage: "user: hello",
      model: LlmModel.GPT_5_2,
    });
    expect(messageRepository.create).toHaveBeenNthCalledWith(2, {
      conversation: { connect: { id: "c1" } },
      role: MessageRole.assistant,
      content: "assistant reply",
    });
    expect(usageMetricsService.recordInteraction).toHaveBeenCalledTimes(1);
    const interaction = usageMetricsService.recordInteraction.mock.calls[0][0];
    expect(interaction).toMatchObject({
      agentConfigurationId: "a1",
      messageCount: 2,
      llmCalls: 1,
      totalTokens: 42,
    });
    expect(interaction.totalLatencyMs).toBeGreaterThanOrEqual(0);
    expect(result.userMessage.id).toBe("m-user");
    expect(result.assistantMessage.id).toBe("m-assistant");
  });

  it("getMessagesByConversationId throws when conversation is missing", async () => {
    conversationRepository.findById.mockResolvedValue(null);

    await expect(
      service.getMessagesByConversationId("missing")
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("getMessagesByConversationId returns paginated messages when conversation exists", async () => {
    conversationRepository.findById.mockResolvedValue({ id: "c1" } as any);
    messageRepository.findPaginatedByConversation.mockResolvedValue({
      items: [
        {
          id: "m1",
          conversationId: "",
          role: "user",
          content: "",
          createdAt: new Date(),
        },
      ],
      meta: { total: 1, totalPages: 1, currentPage: 1, pageSize: 10 },
    });

    const result = await service.getMessagesByConversationId("c1", 2, 5);

    expect(messageRepository.findPaginatedByConversation).toHaveBeenCalledWith(
      "c1",
      2,
      5
    );
    expect(result.items[0].id).toBe("m1");
  });
});
