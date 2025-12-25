/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, it, expect, jest } from "@jest/globals";
import { PrismaService } from "../../prisma/prisma.service";
import { UsageMetricsRepository } from "./usage-metrics.repository";

type UsageMetricsDelegate = PrismaService["usageMetrics"];
type AgentConfigurationDelegate = PrismaService["agentConfiguration"];

type PrismaServiceMock = {
  usageMetrics: {
    upsert: jest.MockedFunction<UsageMetricsDelegate["upsert"]>;
    aggregate: jest.MockedFunction<UsageMetricsDelegate["aggregate"]>;
    findMany: jest.MockedFunction<UsageMetricsDelegate["findMany"]>;
  };
  agentConfiguration: {
    findUnique: jest.MockedFunction<AgentConfigurationDelegate["findUnique"]>;
  };
};

const createMockFn = () => jest.fn();

const buildRepository = (mocks?: Partial<PrismaServiceMock>) => {
  const prismaMock: PrismaServiceMock = {
    usageMetrics: {
      upsert: createMockFn() as any,
      aggregate: createMockFn() as any,
      findMany: createMockFn() as any,
    },
    agentConfiguration: {
      findUnique: createMockFn() as any,
    },
    ...mocks,
  };

  return {
    repo: new UsageMetricsRepository(prismaMock as unknown as PrismaService),
    prismaMock,
  };
};

describe("UsageMetricsRepository", () => {
  describe("incrementForAgent", () => {
    const baseMetrics = {
      id: "metric-1",
      agentConfigurationId: "agent-1",
      messageCount: 5,
      llmCalls: 2,
      totalTokens: 100,
      totalLatencyMs: 200,
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    };

    it("increments metrics and returns with agent info", async () => {
      const { repo, prismaMock } = buildRepository();
      prismaMock.usageMetrics.upsert.mockResolvedValue(baseMetrics);
      prismaMock.agentConfiguration.findUnique.mockResolvedValue({
        id: "agent-1",
        name: "Agent One",
      } as any);

      const result = await repo.incrementForAgent("agent-1", {
        messageCount: 1,
        llmCalls: 1,
        totalTokens: 10,
        totalLatencyMs: 50,
      });

      expect(prismaMock.usageMetrics.upsert).toHaveBeenCalledWith({
        where: { agentConfigurationId: "agent-1" },
        create: {
          agentConfigurationId: "agent-1",
          messageCount: 1,
          llmCalls: 1,
          totalTokens: 10,
          totalLatencyMs: 50,
        },
        update: {
          messageCount: { increment: 1 },
          llmCalls: { increment: 1 },
          totalTokens: { increment: 10 },
          totalLatencyMs: { increment: 50 },
        },
      });
      expect(result).toEqual({
        ...baseMetrics,
        agentConfiguration: { id: "agent-1", name: "Agent One" },
      });
    });

    it("uses zero defaults when deltas are omitted", async () => {
      const { repo, prismaMock } = buildRepository();
      prismaMock.usageMetrics.upsert.mockResolvedValue(baseMetrics);
      prismaMock.agentConfiguration.findUnique.mockResolvedValue({
        id: "agent-1",
        name: "Agent One",
      } as any);

      await repo.incrementForAgent("agent-1", {});

      expect(prismaMock.usageMetrics.upsert).toHaveBeenCalledWith({
        where: { agentConfigurationId: "agent-1" },
        create: {
          agentConfigurationId: "agent-1",
          messageCount: 0,
          llmCalls: 0,
          totalTokens: 0,
          totalLatencyMs: 0,
        },
        update: {
          messageCount: { increment: 0 },
          llmCalls: { increment: 0 },
          totalTokens: { increment: 0 },
          totalLatencyMs: { increment: 0 },
        },
      });
    });

    it("throws when agent is missing", async () => {
      const { repo, prismaMock } = buildRepository();
      prismaMock.usageMetrics.upsert.mockResolvedValue(baseMetrics);
      prismaMock.agentConfiguration.findUnique.mockResolvedValue(null);

      await expect(repo.incrementForAgent("missing-agent", {})).rejects.toThrow(
        "AgentConfiguration with id missing-agent not found"
      );
    });
  });

  describe("aggregateTotals", () => {
    it("delegates to prisma aggregate", async () => {
      const aggregateResult = { _sum: { llmCalls: 2 } };
      const { repo, prismaMock } = buildRepository();
      prismaMock.usageMetrics.aggregate.mockResolvedValue(
        aggregateResult as any
      );

      const result = await repo.aggregateTotals();

      expect(prismaMock.usageMetrics.aggregate).toHaveBeenCalledWith({
        _sum: {
          messageCount: true,
          llmCalls: true,
          totalTokens: true,
          totalLatencyMs: true,
        },
      });
      expect(result).toBe(aggregateResult);
    });
  });

  describe("findAllWithAgent", () => {
    it("fetches all metrics including agent", async () => {
      const rows = [
        {
          id: "metric-1",
          agentConfigurationId: "agent-1",
          messageCount: 1,
          llmCalls: 1,
          totalTokens: 10,
          totalLatencyMs: 50,
          updatedAt: new Date(),
          agentConfiguration: { id: "agent-1", name: "Agent One" },
        },
      ];
      const { repo, prismaMock } = buildRepository();
      prismaMock.usageMetrics.findMany.mockResolvedValue(rows);

      const result = await repo.findAllWithAgent();

      expect(prismaMock.usageMetrics.findMany).toHaveBeenCalledWith({
        include: { agentConfiguration: { select: { id: true, name: true } } },
        orderBy: { updatedAt: "desc" },
      });
      expect(result).toBe(rows);
    });
  });
});
