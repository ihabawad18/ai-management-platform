import { UsageMetricsService } from "./usage-metrics.service";

describe("UsageMetricsService", () => {
  const usageMetricsRepository = {
    incrementForAgent: jest.fn(),
    aggregateTotals: jest.fn(),
    findAllWithAgent: jest.fn(),
  };

  let service: UsageMetricsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UsageMetricsService(usageMetricsRepository as any);
  });

  it("records interactions with provided deltas", async () => {
    usageMetricsRepository.incrementForAgent.mockResolvedValue({});

    await service.recordInteraction({
      agentConfigurationId: "a1",
      messageCount: 3,
      llmCalls: 1,
      totalTokens: 100,
      totalLatencyMs: 200,
    });

    expect(usageMetricsRepository.incrementForAgent).toHaveBeenCalledWith(
      "a1",
      {
        messageCount: 3,
        llmCalls: 1,
        totalTokens: 100,
        totalLatencyMs: 200,
      }
    );
  });

  it("computes dashboard metrics with averages", async () => {
    usageMetricsRepository.aggregateTotals.mockResolvedValue({
      _sum: {
        messageCount: 10,
        llmCalls: 5,
        totalTokens: 500,
        totalLatencyMs: 1000,
      },
    });
    usageMetricsRepository.findAllWithAgent.mockResolvedValue([
      {
        agentConfiguration: { id: "a1", name: "Agent One" },
        messageCount: 6,
        llmCalls: 3,
        totalTokens: 300,
        totalLatencyMs: 600,
      },
      {
        agentConfiguration: { id: "a2", name: "Agent Two" },
        messageCount: 4,
        llmCalls: 2,
        totalTokens: 200,
        totalLatencyMs: 400,
      },
    ]);

    const result = await service.getDashboardMetrics();

    expect(result.totals).toEqual({
      messageCount: 10,
      llmCalls: 5,
      totalTokens: 500,
      totalLatencyMs: 1000,
      averageLatencyMs: 200,
    });
    expect(result.agents[0]).toMatchObject({
      agentId: "a1",
      agentName: "Agent One",
      averageLatencyMs: 200,
    });
    expect(result.agents[1]).toMatchObject({
      agentId: "a2",
      agentName: "Agent Two",
      averageLatencyMs: 200,
    });
  });
});
