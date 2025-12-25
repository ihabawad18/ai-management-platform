import { Test, TestingModule } from "@nestjs/testing";
import { AgentConfigurationsRepository } from "./agent-configurations.repository";
import { PrismaService } from "../../prisma/prisma.service";
import type { AgentConfiguration } from "../../../../generated/prisma/client";
import { prismaMock } from "../../../../test/mocks/prisma.mock";

const mockAgent: AgentConfiguration = {
  id: "cfg_1",
  name: "Test Agent",
  systemPrompt: "Be helpful",
  model: "GPT_5_2",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-02T00:00:00.000Z"),
};
jest.mock("../../prisma/prisma.service", () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    prismaMock,
  })),
}));

describe("AgentConfigurationsRepository", () => {
  let repository: AgentConfigurationsRepository;
  const prisma = prismaMock as jest.Mocked<typeof prismaMock>;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentConfigurationsRepository,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    repository = module.get<AgentConfigurationsRepository>(
      AgentConfigurationsRepository
    );
  });

  it("findAll returns ordered agents", async () => {
    prisma.agentConfiguration.findMany.mockResolvedValue([mockAgent]);
    const result = await repository.findAll();
    expect(prisma.agentConfiguration.findMany).toHaveBeenCalledWith(
      expect.objectContaining({})
    );
    expect(result).toEqual([mockAgent]);
  });

  it("findById returns agent", async () => {
    prisma.agentConfiguration.findUnique.mockResolvedValue(mockAgent);
    const result = await repository.findById("cfg_1");
    expect(prisma.agentConfiguration.findUnique).toHaveBeenCalledWith({
      where: { id: "cfg_1" },
    });
    expect(result).toEqual(mockAgent);
  });

  it("create creates agent", async () => {
    prisma.agentConfiguration.create.mockResolvedValue(mockAgent);
    const data = { name: "x", systemPrompt: "y", model: "GPT_5_2" as const };
    const result = await repository.create(data);
    expect(prisma.agentConfiguration.create).toHaveBeenCalledWith({
      data,
    });
    expect(result).toEqual(mockAgent);
  });

  it("update updates agent", async () => {
    prisma.agentConfiguration.update.mockResolvedValue(mockAgent);
    const data = { name: "updated" };
    const result = await repository.update("cfg_1", data);
    expect(prisma.agentConfiguration.update).toHaveBeenCalledWith({
      where: { id: "cfg_1" },
      data,
    });
    expect(result).toEqual(mockAgent);
  });

  it("delete removes agent", async () => {
    prisma.agentConfiguration.delete.mockResolvedValue(mockAgent);
    const result = await repository.delete("cfg_1");
    expect(prisma.agentConfiguration.delete).toHaveBeenCalledWith({
      where: { id: "cfg_1" },
    });
    expect(result).toEqual(mockAgent);
  });

  it("existsById returns boolean", async () => {
    prisma.agentConfiguration.count.mockResolvedValue(1);
    const result = await repository.existsById("cfg_1");
    expect(prisma.agentConfiguration.count).toHaveBeenCalledWith({
      where: { id: "cfg_1" },
    });
    expect(result).toBe(true);
  });
});
