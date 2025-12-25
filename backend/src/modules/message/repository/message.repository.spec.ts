/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { MessageRepository } from "./message.repository";

describe("MessageRepository", () => {
  const findMany = jest.fn();
  const count = jest.fn();
  const mockPrisma = {
    message: {
      findMany,
      count,
    },
  } as any;

  let repository: MessageRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new MessageRepository(mockPrisma);
  });

  it("findByConversation returns latest N messages in chronological order when takeLast is provided", async () => {
    findMany.mockResolvedValue([
      { id: "3", createdAt: new Date("2024-01-03") },
      { id: "2", createdAt: new Date("2024-01-02") },
      { id: "1", createdAt: new Date("2024-01-01") },
    ]);

    const result = await repository.findByConversation("conv-1", {
      takeLast: 3,
    });

    expect(findMany).toHaveBeenCalledWith({
      where: { conversationId: "conv-1" },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
    expect(result.map((m) => m.id)).toEqual(["1", "2", "3"]);
  });

  it("findPaginatedByConversation delegates to BaseRepository pagination with latest first ordering", async () => {
    const items = [{ id: "1" }];
    findMany.mockResolvedValue(items);
    count.mockResolvedValue(1);

    const result = await repository.findPaginatedByConversation("conv-1", 2, 5);

    expect(findMany).toHaveBeenCalledWith({
      where: { conversationId: "conv-1" },
      orderBy: { createdAt: "desc" },
      skip: 5,
      take: 5,
    });
    expect(count).toHaveBeenCalledWith({ where: { conversationId: "conv-1" } });
    expect(result).toEqual({
      items,
      meta: { total: 1, totalPages: 1, currentPage: 2, pageSize: 5 },
    });
  });
});
