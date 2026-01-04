import { NotFoundException } from "@nestjs/common";
import { ConversationService } from "./conversation.service";

describe("ConversationService", () => {
  const conversationRepository = {
    agentExists: jest.fn(),
    findAllByAgentPaginated: jest.fn(),
    create: jest.fn(),
  };

  let service: ConversationService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ConversationService(conversationRepository as any);
  });

  it("throws NotFoundException when agent does not exist for paginated fetch", async () => {
    conversationRepository.agentExists.mockResolvedValue(false);

    await expect(
      service.getAllPaginatedConversationsByAgentConfiguration("a1", 1, 10)
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("returns paginated conversations when agent exists", async () => {
    conversationRepository.agentExists.mockResolvedValue(true);
    conversationRepository.findAllByAgentPaginated.mockResolvedValue({
      items: [{ id: "c1" }],
      meta: { total: 1, totalPages: 1, currentPage: 1, pageSize: 10 },
    });

    const result =
      await service.getAllPaginatedConversationsByAgentConfiguration(
        "a1",
        2,
        5
      );

    expect(conversationRepository.findAllByAgentPaginated).toHaveBeenCalledWith(
      "a1",
      2,
      5
    );
    expect(result.items).toHaveLength(1);
  });

  it("throws NotFoundException when creating a conversation for a missing agent", async () => {
    conversationRepository.agentExists.mockResolvedValue(false);

    await expect(
      service.createNewConversation({ agentId: "a1", title: "T" })
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("creates conversation when agent exists", async () => {
    conversationRepository.agentExists.mockResolvedValue(true);
    conversationRepository.create.mockResolvedValue({
      id: "c1",
      agentConfigurationId: "a1",
      title: "T",
    });

    const result = await service.createNewConversation({
      agentId: "a1",
      title: "T",
    });

    expect(conversationRepository.create).toHaveBeenCalledWith({
      agentConfigurationId: "a1",
      title: "T",
      lastMessageAt: expect.any(Date),
    });
    expect(result.id).toBe("c1");
  });
});
