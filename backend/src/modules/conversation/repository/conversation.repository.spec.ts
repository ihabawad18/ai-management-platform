/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { ConversationRepository } from "./conversation.repository";

describe("ConversationRepository", () => {
  const findMany = jest.fn();
  const count = jest.fn();
  const mockPrisma = {
    conversation: {
      findMany,
      count,
    },
  } as any;

  let repository: ConversationRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new ConversationRepository(mockPrisma);
  });

  it("findAllByAgentPaginated maps lastMessage from newest message content", async () => {
    findMany.mockResolvedValue([
      {
        id: "c1",
        agentConfigurationId: "a1",
        title: "T",
        lastMessageAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: [{ content: "hello" }],
      },
    ]);
    count.mockResolvedValue(1);

    const result = await repository.findAllByAgentPaginated("a1", 1, 10);

    expect(findMany).toHaveBeenCalledWith({
      where: { agentConfigurationId: "a1" },
      orderBy: [{ lastMessageAt: "desc" }, { createdAt: "desc" }],
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { content: true },
        },
      },
      skip: 0,
      take: 10,
    });
    expect(result.items[0].lastMessage).toBe("hello");
    expect(result.meta).toEqual({
      total: 1,
      totalPages: 1,
      currentPage: 1,
      pageSize: 10,
    });
  });
});
