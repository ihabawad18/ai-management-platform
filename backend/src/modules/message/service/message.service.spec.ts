import { NotFoundException } from "@nestjs/common";
import { MessageRole } from "../../../../generated/prisma/client";
import { MessageService } from "./message.service";

describe("MessageService", () => {
  const messageRepository = {
    create: jest.fn(),
    findByConversation: jest.fn(),
    findPaginatedByConversation: jest.fn(),
  };
  const conversationRepository = {
    findById: jest.fn(),
  };
  const agentConfigurationsRepository = {
    findById: jest.fn(),
  };
  const llmService = {
    generateResponse: jest.fn(),
  };

  let service: MessageService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MessageService(
      messageRepository as any,
      conversationRepository as any,
      agentConfigurationsRepository as any,
      llmService as any
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
    });
    agentConfigurationsRepository.findById.mockResolvedValue({
      id: "a1",
      systemPrompt: "You are helpful",
      model: "gpt-test",
    });
    messageRepository.create
      .mockResolvedValueOnce({ id: "m-user", role: MessageRole.user })
      .mockResolvedValueOnce({ id: "m-assistant", role: MessageRole.assistant });
    messageRepository.findByConversation.mockResolvedValue([
      { role: MessageRole.user, content: "hello" },
    ]);
    llmService.generateResponse.mockResolvedValue("assistant reply");

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
      model: "gpt-test",
    });
    expect(messageRepository.create).toHaveBeenNthCalledWith(2, {
      conversation: { connect: { id: "c1" } },
      role: MessageRole.assistant,
      content: "assistant reply",
    });
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
    conversationRepository.findById.mockResolvedValue({ id: "c1" });
    messageRepository.findPaginatedByConversation.mockResolvedValue({
      items: [{ id: "m1" }],
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
